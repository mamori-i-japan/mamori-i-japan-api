import { Injectable, BadRequestException } from '@nestjs/common'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { UpdateUserProfileDto } from './dto/create-user.dto'
import { CreateDiagnosisKeysDto } from './dto/create-diagnosis-keys.dto'
import { DeleteDiagnosisKeysDto } from './dto/delete-diagnosis-keys.dto'
import { POSITIVE_RECOVERY_PERIOD } from './constants'
import * as zlib from 'zlib'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>
  private readonly firestoreStorage: Promise<firebaseAdmin.storage.Storage>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
    this.firestoreStorage = this.firebaseService.Storage()
  }

  async createOne(user: User, userProfile?: UserProfile): Promise<void> {
    user.createdAt = moment.utc()
    await (await this.firestoreDB)
      .collection('users')
      .doc(user.userId)
      .set({ ...user })

    if (userProfile) {
      await (await this.firestoreDB)
        .collection('users')
        .doc(user.userId)
        .collection('profile')
        .doc(user.userId)
        .set({ ...userProfile })
    }
  }

  async findOneUserById(userId: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .get()
    return getDoc.data() as User
  }

  async findOneUserProfileById(userId: string): Promise<UserProfile | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc(userId)
      .get()
    return getDoc.data() as UserProfile
  }

  async createDiagnosisKeys(createDiagnosisKeys: CreateDiagnosisKeysDto): Promise<void> {
    const { randomID, tempIDs, healthCenterToken } = createDiagnosisKeys

    if (!(this.validateHealthCenterToken(/* healthCenterToken */))) {
      throw new BadRequestException()
    }

    await Promise.all(
      tempIDs.map(async ({ tempID, validFrom, validTo }) => {
        await (await this.firestoreDB)
          .collection('diagnosisKeys')
          .doc(tempID)
          .set({ randomID, validFrom, validTo, healthCenterToken })
      })
    )
  }

  async deleteDiagnosisKeys(deleteDiagnosisKeys: DeleteDiagnosisKeysDto): Promise<void> {
    const { randomIDs } = deleteDiagnosisKeys

    if (randomIDs.length === 0) {
      return
    }

    await Promise.all(
      randomIDs.map(async ({ randomID }) => {
        await (await this.firestoreDB)
          .collection('diagnosisKeys')
          .where('randomID', '==', randomID)
          .get()
          .then((query) => {
            query.forEach((doc) => {
              doc.ref.delete()
            })
          })
      })
    )
  }

  async uploadDiagnosisKeysList(): Promise<void> {
    const recoveredDate = moment
      .tz('Asia/Tokyo')
      .startOf('day')
      .subtract(POSITIVE_RECOVERY_PERIOD, 'days')

    const tempIDs = await (await this.firestoreDB)
      .collection('diagnosisKeys')
      .where('validFrom', '>=', recoveredDate)
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return doc.id
        })
      })

    const file = (await this.firestoreStorage).bucket().file('positives.json.gz')
    const json = JSON.stringify({ data: tempIDs })
    const gzip = zlib.gzipSync(json)

    await file.save(gzip)
    await file.setMetadata({ contentType: 'application/gzip' })
  }

  async updateUserProfilePrefecture(updateUserProfileDto: UpdateUserProfileDto): Promise<void> {
    const userId = updateUserProfileDto.userId

    await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc(userId)
      .update({ prefecture: updateUserProfileDto.prefecture })
  }

  // TODO : Implement an integration with Health Center's API.
  //        It's better to make it asynchronous when this is implemented!
  private validateHealthCenterToken(/* healthCenterToken: string */): boolean {
    return true
  }
}

import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import { POSITIVE_RECOVERY_PERIOD } from './constants'
import * as moment from 'moment-timezone'
import * as zlib from 'zlib'
import { CreateDiagnosisKeysForOrgDto } from './dto/create-diagnosis-keys.dto'
import { DeleteUserOrganizationDto } from './dto/delete-user-organization.dto'
import { UpdateUserProfileDto } from './dto/create-user.dto'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>
  private readonly firestoreStorage: Promise<firebaseAdmin.storage.Storage>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
    this.firestoreStorage = this.firebaseService.Storage()
  }

  async createOne(user: User, userProfile?: UserProfile): Promise<void> {
    user.created = moment.utc()
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

  async uploadDiagnosisKeysForOrgList(): Promise<void> {
    const recoveredDate = moment
      .tz('Asia/Tokyo')
      .startOf('day')
      .subtract(POSITIVE_RECOVERY_PERIOD, 'days')

    const organizationCodes = await (await this.firestoreDB)
      .collection('organizations')
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return doc.data().organizationCode
        })
      })

    await Promise.all(
      organizationCodes.map(async (organizationCode) => {
        const tempIDs = await (await this.firestoreDB)
          .collection('diagnosisKeysForOrg')
          .doc(organizationCode)
          .collection('tempIDs')
          .where('validFrom', '>=', recoveredDate)
          .get()
          .then((query) => {
            return query.docs.map((doc) => {
              return doc.id
            })
          })

        const file = (await this.firestoreStorage)
          .bucket()
          .file(`${organizationCode}/positives.json.gz`)
        const json = JSON.stringify({ data: [].concat(...tempIDs) })
        const gzip = zlib.gzipSync(json)

        await file.save(gzip)
        await file.setMetadata({ contentType: 'application/gzip' })
      })
    )
  }

  async deleteDiagnosisKeysForOrg(deleteUserOrganization: DeleteUserOrganizationDto): Promise<void> {
    const { organizationCode, randomID } = deleteUserOrganization

    await (await this.firestoreDB)
      .collection('diagnosisKeysForOrg')
      .doc(organizationCode)
      .collection('tempIDs')
      .where('randomID', '==', randomID)
      .get()
      .then((query) => {
        query.forEach((doc) => {
          doc.ref.delete()
        })
      })
  }

  async createDiagnosisKeysForOrg(
    createDiagnosisKeysForOrg: CreateDiagnosisKeysForOrgDto
  ): Promise<void> {
    const { organizationCode, randomID, tempIDs } = createDiagnosisKeysForOrg

    await Promise.all(
      tempIDs.map(async ({ tempID, validFrom, validTo }) => {
        await (await this.firestoreDB)
          .collection('diagnosisKeysForOrg')
          .doc(organizationCode)
          .collection('tempIDs')
          .doc(tempID)
          .set({ randomID, validFrom, validTo })
      })
    )
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

  async updateUserProfileOrganizationCode(
    updateUserProfileDto: UpdateUserProfileDto
  ): Promise<void> {
    const userId = updateUserProfileDto.userId

    await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc(userId)
      .update({ organizationCode: updateUserProfileDto.organizationCode })
  }

  async deleteUserProfileOrganizationCode(userId: string): Promise<void> {
    await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc(userId)
      .update({ organizationCode: firebaseAdmin.firestore.FieldValue.delete() })
  }
}

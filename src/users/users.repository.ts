import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './interfaces/user.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import { TEMPID_VALIDITY_PERIOD } from './constants'
import CustomEncrypter from '../utils/CustomEncrypter'
import * as moment from 'moment'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(user: User, userProfile?: UserProfile): Promise<void> {
    await (await this.firestoreDB)
      .collection('users')
      .doc(user.userId)
      .set(JSON.parse(JSON.stringify(user)))

    if (userProfile) {
      await (await this.firestoreDB)
        .collection('users')
        .doc(user.userId)
        .collection('profile')
        .doc(user.userId)
        .set(JSON.parse(JSON.stringify(userProfile)))
    }
  }

  async findOne(userId: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .get()
    return getDoc.data() as User
  }

  // TODO @shogo-mitomo : avoid overlapping periods
  async generateTempId(encryptionKey: Buffer, userId: string, i: number) {
    // allow the first message to be valid a minute earlier
    const validFrom = moment
      .utc()
      .add(TEMPID_VALIDITY_PERIOD * i, 'hours')
      .add(-1, 'minute')
    const validTo = validFrom.add(TEMPID_VALIDITY_PERIOD, 'hours')

    // Prepare encrypter
    const customEncrypter = new CustomEncrypter(encryptionKey)

    // Encrypt userId, validFrom, validTo and encode payload
    // 21 bytes for userId, 4 bytes each for validFrom and validTo timestamp
    const USERID_SIZE = 21
    const TIME_SIZE = 4
    const TEMPID_SIZE = USERID_SIZE + TIME_SIZE * 2

    const plainData = Buffer.alloc(TEMPID_SIZE)
    plainData.write(userId, 0, USERID_SIZE, 'base64')
    plainData.writeInt32BE(validFrom.unix(), USERID_SIZE)
    plainData.writeInt32BE(validTo.unix(), USERID_SIZE + TIME_SIZE)

    const encodedData = customEncrypter.encryptAndEncode(plainData)
    const tempID = encodedData.toString('base64')

    const userRef = (await this.firestoreDB).collection('users').doc(userId)

    ;(await this.firestoreDB)
      .collection('tempIDs')
      .doc()
      .set({ userRef, tempID, validFrom, validTo })

    return {
      tempID,
      validFrom,
      validTo,
    }
  }
}

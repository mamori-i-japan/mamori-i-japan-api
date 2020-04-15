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

  async generateTempId(encryptionKey: Buffer, userId: string, i: number) {
    // allow the first message to be valid a minute earlier
    const start = moment.utc().add(TEMPID_VALIDITY_PERIOD * i, 'hours').add(-1, 'minute')
    const expiry = start.add(TEMPID_VALIDITY_PERIOD, 'hours')

    // Prepare encrypter
    const customEncrypter = new CustomEncrypter(encryptionKey)

    // Encrypt userId, start, expiry and encode payload
    // 21 bytes for userId, 4 bytes each for start and expiry timestamp
    const USERID_SIZE = 21
    const TIME_SIZE = 4
    const TEMPID_SIZE = USERID_SIZE + TIME_SIZE * 2

    const plainData = Buffer.alloc(TEMPID_SIZE)
    plainData.write(userId, 0, USERID_SIZE, 'base64')
    plainData.writeInt32BE(start.unix(), USERID_SIZE)
    plainData.writeInt32BE(expiry.unix(), USERID_SIZE + TIME_SIZE)

    const encodedData = customEncrypter.encryptAndEncode(plainData)
    const tempID = encodedData.toString('base64')

    return {
      tempID: tempID,
      validFrom: start,
      validTo: expiry,
    }
  }
}

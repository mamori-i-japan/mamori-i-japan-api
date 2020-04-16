import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './interfaces/user.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import { TEMPID_VALIDITY_PERIOD } from './constants'
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
  async generateTempId(userId: string, i: number) {
    // allow the first message to be valid a minute earlier
    const validFrom = moment
      .utc()
      .add(TEMPID_VALIDITY_PERIOD * i, 'hours')
      .add(-1, 'minute')
    const validTo = validFrom.add(TEMPID_VALIDITY_PERIOD, 'hours')

    const userRef = (await this.firestoreDB).collection('users').doc(userId)

    const tempID = await (await this.firestoreDB)
      .collection('userStatuses')
      .doc(userId)
      .collection('tempIDs')
      .add({ validFrom, validTo })
      .then(doc => { return doc.id })

    return {
      tempID,
      validFrom,
      validTo,
    }
  }
}

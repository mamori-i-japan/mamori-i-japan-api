import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './interfaces/user.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import { TEMPID_VALIDITY_PERIOD, TEMPID_SWITCHOVER_TIME } from './constants'
import * as moment from 'moment'
import { TempID } from './interfaces/temp-id.interface'

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

  async findOneById(userId: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .get()
    return getDoc.data() as User
  }

  async generateTempId(userId: string, i: number): Promise<TempID> {
    const yesterday = moment.utc().subtract(1, 'day')
    const startTime = yesterday
      .startOf('day')
      .hour(TEMPID_SWITCHOVER_TIME)
      .add(TEMPID_VALIDITY_PERIOD * i, 'hours')
    const validFrom = startTime.clone().toDate()
    const validTo = startTime.add(TEMPID_VALIDITY_PERIOD, 'hours').toDate()

    const collection = (await this.firestoreDB)
      .collection('userStatuses')
      .doc(userId)
      .collection('tempIDs')

    let tempID = await collection
      .where('validFrom', '==', validFrom)
      .where('validTo', '==', validTo)
      .limit(1)
      .get()
      .then((query) => {
        return query.docs.length === 0 ? undefined : query.docs[0].id
      })

    tempID =
      tempID ||
      (await collection.add({ validFrom, validTo }).then((doc) => {
        return doc.id
      }))

    return {
      tempID,
      validFrom,
      validTo,
    }
  }
}

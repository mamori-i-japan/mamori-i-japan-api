import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import {
  TEMPID_VALIDITY_PERIOD,
  TEMPID_SWITCHOVER_TIME,
  POSITIVE_RECOVERY_PERIOD,
  POSITIVE_REPRODUCTION_PERIOD,
} from './constants'
import * as moment from 'moment-timezone'
import { TempID } from './classes/temp-id.class'
import * as zlib from 'zlib'
import { CloseContact } from './classes/close-contact.class'

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

  async findOneById(userId: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .get()
    return getDoc.data() as User
  }

  async generateTempId(userId: string, i: number): Promise<TempID> {
    const yesterday = moment.tz('Asia/Tokyo').subtract(1, 'day')
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
      validFrom: moment(validFrom).unix(),
      validTo: moment(validTo).unix(),
    }
  }

  async uploadPositiveList(): Promise<void> {
    const recoveredDate = moment
      .tz('Asia/Tokyo')
      .startOf('day')
      .subtract(POSITIVE_RECOVERY_PERIOD, 'days')

    // NOTE : need to create a composite index on Cloud Firestore
    const userIDs = await (await this.firestoreDB)
      .collection('userStatuses')
      .where('positive', '==', true)
      .where('testDate', '>=', recoveredDate)
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return { id: doc.id, testDate: doc.data().testDate }
        })
      })

    const tempIDs = await Promise.all(
      userIDs.map(async (doc) => {
        const id = doc.id
        const testDate = moment(doc.testDate.toDate())
          .tz('Asia/Tokyo')
          .endOf('day')
        const reproductionDate = moment
          .tz('Asia/Tokyo')
          .startOf('day')
          .subtract(POSITIVE_REPRODUCTION_PERIOD, 'days')

        return (await this.firestoreDB)
          .collection('userStatuses')
          .doc(id)
          .collection('tempIDs')
          .where('validFrom', '>=', reproductionDate)
          .where('validFrom', '<=', testDate.subtract(TEMPID_VALIDITY_PERIOD, 'hours'))
          .get()
          .then((query) => {
            return query.docs.map((doc) => {
              return { tempID: doc.id }
            })
          })
      })
    )

    const file = (await this.firestoreStorage).bucket().file('positives.json.gz')
    const json = JSON.stringify({ data: [].concat(...tempIDs) })
    const gzip = zlib.gzipSync(json)

    await file.save(gzip)
    await file.setMetadata({ contentType: 'application/gzip' })

    return
  }

  async createOneCloseContact(userId: string, closeContact: CloseContact): Promise<void> {
    await (await this.firestoreDB)
      .collection('userCloseContacts')
      .doc(userId)
      .collection('closeContacts')
      .doc(closeContact.uniqueInsertKey)
      .set({ ...closeContact })
  }
}

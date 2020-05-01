import { Injectable, NotFoundException } from '@nestjs/common'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import {
  TEMPID_VALIDITY_PERIOD,
  POSITIVE_RECOVERY_PERIOD,
  POSITIVE_REPRODUCTION_PERIOD,
} from './constants'
import * as moment from 'moment-timezone'
import * as zlib from 'zlib'
import { SetSelfReportedPositiveFlagDto } from './dto/set-positive-flag.dto'
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

  async uploadPositiveList(): Promise<void> {
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
        // NOTE : need to create a composite index on Cloud Firestore
        const userIDs = await (await this.firestoreDB)
          .collection('userStatuses')
          .where('organizationCode', '==', organizationCode)
          .where('selfReportedPositive', '==', true)
          .where('reportDate', '>=', recoveredDate)
          .get()
          .then((query) => {
            return query.docs.map((doc) => {
              return { id: doc.id, reportDate: doc.data().reportDate }
            })
          })

        const tempIDs = await Promise.all(
          userIDs.map(async (doc) => {
            const id = doc.id
            const reportDate = moment(doc.reportDate.toDate())
              .tz('Asia/Tokyo')
              .endOf('day')
            const reproductionDate = moment
              .tz('Asia/Tokyo')
              .startOf('day')
              .subtract(POSITIVE_REPRODUCTION_PERIOD, 'days')

            return (
              (await this.firestoreDB)
                .collection('userStatuses')
                .doc(id)
                .collection('tempIDs')
                .where(
                  'validFrom',
                  '>=',
                  reproductionDate.subtract(TEMPID_VALIDITY_PERIOD, 'hours')
                )
                // NOTE : .where('validTo', '>=', reproductionDate)
                //        it should have been written as above, but due to Firestore's limitations, we are forced to write it this way
                //        refs. https://firebase.google.com/docs/firestore/query-data/queries#compound_queries
                .where('validFrom', '<=', reportDate)
                .get()
                .then((query) => {
                  return query.docs.map((doc) => {
                    return { tempID: doc.id }
                  })
                })
            )
          })
        )

        const file = (await this.firestoreStorage)
          .bucket()
          .file(`${organizationCode}/positives.json.gz`)
        const json = JSON.stringify({ data: [].concat(...tempIDs) })
        const gzip = zlib.gzipSync(json)

        await file.save(gzip)
        await file.setMetadata({ contentType: 'application/gzip' })
      })
    )

    return
  }

  async setSelfReportedPositiveFlag(
    setSelfReportedPositiveFlag: SetSelfReportedPositiveFlagDto
  ): Promise<void> {
    const userId = setSelfReportedPositiveFlag.userId
    const userProfile = await this.findOneUserProfileById(userId)

    if (!userProfile) {
      throw new NotFoundException()
    }

    await (await this.firestoreDB)
      .collection('userStatuses')
      .doc(userId)
      .update({
        selfReportedPositive: true,
        reportDate: moment.tz('Asia/Tokyo'),
        organizationCode: setSelfReportedPositiveFlag.organizationCode,
      })
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

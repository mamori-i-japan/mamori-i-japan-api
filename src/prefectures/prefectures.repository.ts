import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { Prefecture, PrefectureForAppAccess } from './classes/prefecture.class'
import { UpdatePrefectureRequestDto } from './dto/create-prefecture.dto'

@Injectable()
export class PrefecturesRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(prefecture: Prefecture): Promise<Prefecture> {
    prefecture.createdAt = moment.utc()

    await (await this.firestoreDB)
      .collection('prefectures')
      .doc(prefecture.prefectureId.toString())
      .set({ ...prefecture })

    // In case an prefecture message has been provided, we create a copy of the message
    // in denormalizedForAppAccess sub-collection.
    // We denormalize this data to keep our get/list queries for admin webapp simple,
    // since we don't need to fetch the sub-collection every time.
    if (prefecture.message || prefecture.message === '') {
      const denormalizedForAppAccess: PrefectureForAppAccess = {
        messageForAppAccess: prefecture.message,
      }
      await (await this.firestoreDB)
        .collection('prefectures')
        .doc(prefecture.prefectureId.toString())
        .collection('denormalizedForAppAccess')
        .doc(prefecture.prefectureId.toString())
        .set({ ...denormalizedForAppAccess })
    }

    return prefecture
  }

  async findOneById(prefectureId: number): Promise<Prefecture | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('prefectures')
      .doc(prefectureId.toString())
      .get()
    return getDoc.data() as Prefecture
  }

  /**
   * List endpoint that returns all prefectures.
   * It uses the passed userAccessKey to match against the accessControlList array
   * in the where clause of the list query.
   * @param userAccessKey: string
   */
  async findAll(userAccessKey: string): Promise<Prefecture[]> {
    const prefecturesArray: Prefecture[] = []

    const prefecturesRef = (await this.firestoreDB).collection('prefectures')
    await prefecturesRef
      .orderBy('prefectureId', 'asc')
      .limit(100)
      .where('accessControlList', 'array-contains', userAccessKey)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return []
        }

        snapshot.forEach((doc) => {
          const prefectureEach: Prefecture = {
            prefectureId: parseInt(doc.id, 10),
            name: doc.data().name,
            message: doc.data().message,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
            accessControlList: doc.data().accessControlList,
          }
          prefecturesArray.push(prefectureEach)
        })
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        throw new Error(err)
      })

    return prefecturesArray
  }

  async updateOne(updatePrefectureRequest: UpdatePrefectureRequestDto): Promise<void> {
    const prefectureId = updatePrefectureRequest.prefectureId
    const existingPrefecture = await this.findOneById(prefectureId)

    if (!existingPrefecture) {
      throw new NotFoundException('Could not find prefecture with this id')
    }

    await (await this.firestoreDB)
      .collection('prefectures')
      .doc(prefectureId.toString())
      .update({
        ...updatePrefectureRequest,
        updatedAt: moment.utc(),
      })

    // In case an prefecture message has been provided, we update the copy of the message
    // in denormalizedForAppAccess sub-collection.
    // We denormalize this data to keep our get/list queries for admin webapp simple,
    // since we don't need to fetch the sub-collection every time.
    if (updatePrefectureRequest.message || updatePrefectureRequest.message === '') {
      const denormalizedForAppAccess: PrefectureForAppAccess = {
        messageForAppAccess: updatePrefectureRequest.message,
      }
      await (await this.firestoreDB)
        .collection('prefectures')
        .doc(prefectureId.toString())
        .collection('denormalizedForAppAccess')
        .doc(prefectureId.toString())
        .set({ ...denormalizedForAppAccess })
    }
  }
}

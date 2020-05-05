import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { Prefecture } from './classes/prefecture.class'
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
      .doc(prefecture.prefectureId)
      .set({ ...prefecture })

    return prefecture
  }

  async findOneById(prefectureId: string): Promise<Prefecture | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('prefectures')
      .doc(prefectureId)
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
      .limit(100)
      .where('accessControlList', 'array-contains', userAccessKey)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return []
        }

        snapshot.forEach((doc) => {
          const prefectureEach: Prefecture = {
            prefectureId: doc.id,
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
    const prefecture = await this.findOneById(prefectureId)

    if (!prefecture) {
      throw new NotFoundException('Could not find prefecture with this id')
    }

    await (await this.firestoreDB)
      .collection('prefectures')
      .doc(prefectureId)
      .update({
        ...updatePrefectureRequest,
        updatedAt: moment.utc(),
      })
  }
}

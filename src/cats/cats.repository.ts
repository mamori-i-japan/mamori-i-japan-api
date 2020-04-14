import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'
import { FirebaseService } from '../firebase/firebase.service'

@Injectable()
export class CatsRepository {
  // db: firebaseAdmin.firestore.Firestore
  // catsCollectionRef = db.collection('cats')

  constructor(private firebaseService: FirebaseService) {}
  async createOne(cat: Cat) {
    return (await this.firebaseService.firebaseFirestore())
      .collection('cats')
      .doc(cat.name)
      .set(cat)
  }

  async findOne(name: string): Promise<Cat | undefined> {
    const getDoc = await (await this.firebaseService.firebaseFirestore())
      .collection('cats')
      .doc(name)
      .get()
    return getDoc.data() as Cat
  }
}

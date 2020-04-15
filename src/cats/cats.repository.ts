import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class CatsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }
  async createOne(cat: Cat) {
    return (await this.firestoreDB)
      .collection('cats')
      .doc(cat.name)
      .set(JSON.parse(JSON.stringify(cat)))
  }

  async findOne(name: string): Promise<Cat | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('cats')
      .doc(name)
      .get()
    return getDoc.data() as Cat
  }
}

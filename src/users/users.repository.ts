import { Injectable } from '@nestjs/common'
import { User } from './interfaces/user.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }
  async createOne(user: User) {
    return (await this.firestoreDB)
      .collection('users')
      .doc(user.userId)
      .set(user)
  }

  async findOne(userId: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .get()
    return getDoc.data() as User
  }
}

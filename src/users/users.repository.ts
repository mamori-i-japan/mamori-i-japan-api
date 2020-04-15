import { Injectable } from '@nestjs/common'
import { User } from './interfaces/user.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }
  async createOne(createUserDto: CreateUserDto) {
    return (await this.firestoreDB)
      .collection('users')
      .doc(createUserDto.userId)
      .set(createUserDto)
  }

  async findOne(name: string): Promise<User | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('users')
      .doc(name)
      .get()
    return getDoc.data() as User
  }
}

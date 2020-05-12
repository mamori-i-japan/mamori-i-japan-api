import { Injectable } from '@nestjs/common'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { UpdateUserProfileDto } from './dto/create-user.dto'

@Injectable()
export class UsersRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(user: User, userProfile?: UserProfile): Promise<void> {
    user.createdAt = moment.utc()
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

  async updateUserProfilePrefecture(updateUserProfileDto: UpdateUserProfileDto): Promise<void> {
    const userId = updateUserProfileDto.userId

    await (await this.firestoreDB)
      .collection('users')
      .doc(userId)
      .collection('profile')
      .doc(userId)
      .update({ prefecture: updateUserProfileDto.prefecture })
  }
}

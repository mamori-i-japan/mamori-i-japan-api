import { Injectable } from '@nestjs/common'
import { Admin, AdminProfile } from './interfaces/admin.interface'
import { FirebaseService } from '../firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class AdminsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(admin: Admin, adminProfile?: AdminProfile): Promise<void> {
    await (await this.firestoreDB)
      .collection('admins')
      .doc(admin.adminUserId)
      .set(JSON.parse(JSON.stringify(admin)))

    if (adminProfile) {
      await (await this.firestoreDB)
        .collection('admins')
        .doc(admin.adminUserId)
        .collection('profile')
        .doc(admin.adminUserId)
        .set(JSON.parse(JSON.stringify(adminProfile)))
    }
  }

  async findOne(adminUserId: string): Promise<Admin | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('admins')
      .doc(adminUserId)
      .get()
    return getDoc.data() as Admin
  }

  async findAll(): Promise<Admin[] | undefined> {
    const adminsArray: Admin[] = []

    const adminsRef = (await this.firestoreDB).collection('admins')
    await adminsRef
      .limit(100)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return
        }

        snapshot.forEach((doc) => {
          const adminEach: Admin = {
            adminUserId: doc.id,
            email: doc.data().email,
          }
          adminsArray.push(adminEach)
        })
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        throw new Error(err)
      })

    return adminsArray
  }
}

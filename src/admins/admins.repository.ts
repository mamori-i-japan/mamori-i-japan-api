import { Injectable } from '@nestjs/common'
import { Admin } from './classes/admin.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'

@Injectable()
export class AdminsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(admin: Admin): Promise<void> {
    admin.createdAt = moment.utc()
    await (await this.firestoreDB)
      .collection('admins')
      .doc(admin.adminUserId)
      .set({ ...admin })
  }

  async findOneById(adminUserId: string): Promise<Admin | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('admins')
      .doc(adminUserId)
      .get()
    return getDoc.data() as Admin
  }

  async findOneByEmail(email: string): Promise<Admin | undefined> {
    let admin: Admin

    const adminsRef = (await this.firestoreDB).collection('admins')
    await adminsRef
      .limit(1)
      .where('email', '==', email)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return
        }

        snapshot.forEach((doc) => {
          admin = {
            adminUserId: doc.id,
            userAdminRole: doc.data().userAdminRole,
            userAccessKey: doc.data().userAccessKey,
            prefectureId: doc.data().prefectureId,
            email: doc.data().email,
            addedByAdminUserId: doc.data().addedByAdminUserId,
            addedByAdminEmail: doc.data().addedByAdminEmail,
            createdAt: doc.data().createdAt,
            accessControlList: doc.data().accessControlList,
          }
        })
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        throw new Error(err)
      })

    return admin
  }

  async findAll(userAccessKey: string): Promise<Admin[] | undefined> {
    const adminsArray: Admin[] = []

    const adminsRef = (await this.firestoreDB).collection('admins')
    await adminsRef
      .limit(100)
      .where('accessControlList', 'array-contains', userAccessKey)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return
        }

        snapshot.forEach((doc) => {
          const adminEach: Admin = {
            adminUserId: doc.id,
            userAdminRole: doc.data().userAdminRole,
            userAccessKey: doc.data().userAccessKey,
            prefectureId: doc.data().prefectureId,
            email: doc.data().email,
            addedByAdminUserId: doc.data().addedByAdminUserId,
            addedByAdminEmail: doc.data().addedByAdminEmail,
            createdAt: doc.data().createdAt,
            accessControlList: doc.data().accessControlList,
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

  async deleteOneById(adminUserId: string): Promise<void> {
    await (await this.firestoreDB)
      .collection('admins')
      .doc(adminUserId)
      .delete()
  }
}

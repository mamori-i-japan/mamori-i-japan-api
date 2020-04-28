import { Injectable } from '@nestjs/common'
import { Admin, AdminProfile } from './classes/admin.class'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'

@Injectable()
export class AdminsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(admin: Admin, adminProfile?: AdminProfile): Promise<void> {
    admin.created = moment.utc()
    await (await this.firestoreDB)
      .collection('admins')
      .doc(admin.adminUserId)
      .set({ ...admin })

    if (adminProfile) {
      await (await this.firestoreDB)
        .collection('admins')
        .doc(admin.adminUserId)
        .collection('profile')
        .doc(admin.adminUserId)
        .set({ ...adminProfile })
    }
  }

  async findOneById(adminUserId: string): Promise<Admin | undefined> {
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
            addedByAdminUserId: doc.data().addedByAdminUserId,
            addedByAdminEmail: doc.data().addedByAdminEmail,
            created: doc.data().created,
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

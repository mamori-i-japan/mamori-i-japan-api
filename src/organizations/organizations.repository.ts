import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { Organization } from './classes/organization.class'

@Injectable()
export class OrganizationsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async findAll(): Promise<Organization[]> {
    const organizationsArray: Organization[] = []

    const organizationsRef = (await this.firestoreDB).collection('organizations')
    await organizationsRef
      .limit(100)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return []
        }

        snapshot.forEach((doc) => {
          const organizationEach: Organization = {
            id: doc.id,
            name: doc.data().name,
            organizationCode: doc.data().organizationCode,
            addedByAdminUserId: doc.data().addedByAdminUserId,
            addedByAdminEmail: doc.data().addedByAdminEmail,
            created: doc.data().created,
          }
          organizationsArray.push(organizationEach)
        })
      })
      .catch((err) => {
        console.log('Error getting documents', err)
        throw new Error(err)
      })

    return organizationsArray
  }
}

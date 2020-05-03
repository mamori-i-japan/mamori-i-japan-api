import { Injectable, NotFoundException } from '@nestjs/common'
import { FirebaseService } from '../shared/firebase/firebase.service'
import * as firebaseAdmin from 'firebase-admin'
import * as moment from 'moment-timezone'
import { Organization } from './classes/organization.class'
import { UpdateOrganizationRequestDto } from './dto/create-organization.dto'

@Injectable()
export class OrganizationsRepository {
  private readonly firestoreDB: Promise<firebaseAdmin.firestore.Firestore>

  constructor(private firebaseService: FirebaseService) {
    this.firestoreDB = this.firebaseService.Firestore()
  }

  async createOne(organization: Organization): Promise<void> {
    organization.created = moment.utc()

    await (await this.firestoreDB)
      .collection('organizations')
      .doc(organization.organizationCode)
      .set({ ...organization })
  }

  async findOneById(organizationId: string): Promise<Organization | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('organizations')
      .doc(organizationId)
      .get()
    return getDoc.data() as Organization
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
            organizationId: doc.id,
            name: doc.data().name,
            message: doc.data().message,
            organizationCode: doc.data().organizationCode,
            addedByAdminUserId: doc.data().addedByAdminUserId,
            addedByAdminEmail: doc.data().addedByAdminEmail,
            created: doc.data().created,
            accessControlList: doc.data().accessControlList,
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

  async updateOne(updateOrganizationRequest: UpdateOrganizationRequestDto): Promise<void> {
    const organizationId = updateOrganizationRequest.organizationId
    const organization = await this.findOneById(organizationId)

    if (!organization) {
      throw new NotFoundException('Could not find organization with this id')
    }

    await (await this.firestoreDB)
      .collection('organizations')
      .doc(organizationId)
      .update({
        ...updateOrganizationRequest,
        updatedAt: moment.utc(),
      })
  }
}

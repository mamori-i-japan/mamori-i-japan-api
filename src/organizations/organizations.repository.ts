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

  async createOne(organization: Organization): Promise<Organization> {
    organization.createdAt = moment.utc()

    await (await this.firestoreDB)
      .collection('organizations')
      .doc(organization.organizationCode)
      .set({ ...organization })

    return organization
  }

  async findOneById(organizationId: string): Promise<Organization | undefined> {
    const getDoc = await (await this.firestoreDB)
      .collection('organizations')
      .doc(organizationId)
      .get()
    return getDoc.data() as Organization
  }

  /**
   * List endpoint that returns all organizations.
   * It uses the passed userAccessKey to match against the accessControlList array
   * in the where clause of the list query.
   * @param userAccessKey: string
   */
  async findAll(userAccessKey: string): Promise<Organization[]> {
    const organizationsArray: Organization[] = []

    const organizationsRef = (await this.firestoreDB).collection('organizations')
    await organizationsRef
      .limit(100)
      .where('accessControlList', 'array-contains', userAccessKey)
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
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
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

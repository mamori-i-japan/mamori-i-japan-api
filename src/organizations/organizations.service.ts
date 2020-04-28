import { Injectable, BadRequestException } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { OrganizationsRepository } from './organizations.repository'
import { CreateOrganizationRequestDto } from './dto/create-organization.dto'
import { Organization } from './classes/organization.class'

@Injectable()
export class OrganizationsService {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async createOneOrganization(
    createOrganizationRequest: CreateOrganizationRequestDto
  ): Promise<void> {
    console.log('createOrganizationRequest : ', createOrganizationRequest)
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return []
  }
}

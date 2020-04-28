import { Injectable, BadRequestException } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { OrganizationsRepository } from './organizations.repository'
import { CreateOrganizationRequestDto } from './dto/create-organization.dto'

@Injectable()
export class OrganizationsService {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async createOneOrganization(
    createOrganizationRequest: CreateOrganizationRequestDto
  ): Promise<void> {
    console.log('createOrganizationRequest : ', createOrganizationRequest)
  }
}

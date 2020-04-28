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

    require('crypto').randomBytes(4, function(err, buffer) {
      const token = buffer.toString('hex')
      console.log('token : ', token.toUpperCase())
    })

    require('crypto').randomBytes(4, function(err, buffer) {
      const token = buffer.toString('hex')
      console.log('token : ', token.toUpperCase())
    })
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return this.organizationsRepository.findAll()
  }
}

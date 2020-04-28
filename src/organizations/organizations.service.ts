import { Injectable, BadRequestException } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { OrganizationsRepository } from './organizations.repository'
import { CreateOrganizationRequestDto, CreateOrganizationDto } from './dto/create-organization.dto'
import { Organization } from './classes/organization.class'
import { randomBytes } from 'crypto'

@Injectable()
export class OrganizationsService {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async createOneOrganization(
    createOrganizationRequest: CreateOrganizationRequestDto
  ): Promise<void> {
    const randomCode = await this.generateUniqueOrganizationCode()

    const createOrganizationDto: CreateOrganizationDto = new CreateOrganizationDto()
    createOrganizationDto.id = randomCode
    createOrganizationDto.name = createOrganizationRequest.name
    createOrganizationDto.organizationCode = randomCode
    createOrganizationDto.addedByAdminUserId = createOrganizationRequest.addedByAdminUserId
    createOrganizationDto.addedByAdminEmail = createOrganizationRequest.addedByAdminEmail

    return this.organizationsRepository.createOne(createOrganizationDto)
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return this.organizationsRepository.findAll()
  }

  private async generateUniqueOrganizationCode(): Promise<string> {
    const randomCode = randomBytes(4) // Creates a 8 (4*2) string code.
      .toString('hex') // Use hex to avoid special characters.
      .toUpperCase()

    const organization = await this.organizationsRepository.findOneById(randomCode)
    if (organization) {
      // If organization exists for this random code, run the generate function again.
      return this.generateUniqueOrganizationCode()
    }

    return randomCode
  }
}

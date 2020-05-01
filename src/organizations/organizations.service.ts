import { Injectable } from '@nestjs/common'
import { OrganizationsRepository } from './organizations.repository'
import {
  CreateOrganizationRequestDto,
  UpdateOrganizationRequestDto,
} from './dto/create-organization.dto'
import { Organization } from './classes/organization.class'
import { randomBytes } from 'crypto'

@Injectable()
export class OrganizationsService {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async createOneOrganization(
    createOrganizationRequestDto: CreateOrganizationRequestDto
  ): Promise<void> {
    const randomCode = await this.generateUniqueOrganizationCode()

    createOrganizationRequestDto.id = randomCode
    createOrganizationRequestDto.organizationCode = randomCode

    return this.organizationsRepository.createOne(createOrganizationRequestDto)
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return this.organizationsRepository.findAll()
  }

  async findOneOrganizationById(organizationId: string): Promise<Organization> {
    return this.organizationsRepository.findOneById(organizationId)
  }

  async updateOneOrganization(
    updateOrganizationRequest: UpdateOrganizationRequestDto
  ): Promise<void> {
    return this.organizationsRepository.updateOne(updateOrganizationRequest)
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

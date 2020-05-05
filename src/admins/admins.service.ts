import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminRequestDto } from './dto/create-admin.dto'
import { Admin } from './classes/admin.class'
import * as firebaseAdmin from 'firebase-admin'
import {
  AdminRole,
  canUserCreateSuperAdmin,
  getSuperAdminACLKey,
  getOrganizationAdminACLKey,
  canUserCreateOrganizationAdmin,
  canUserCreateNationalAdmin,
  canUserCreatePrefectureAdmin,
} from '../shared/acl'
import { RequestAdminUser } from '../shared/interfaces'
import { OrganizationsService } from '../organizations/organizations.service'
import { PrefecturesService } from '../prefectures/prefectures.service'

@Injectable()
export class AdminsService {
  constructor(
    private adminsRepository: AdminsRepository,
    private organizationsService: OrganizationsService,
    private prefecturesService: PrefecturesService
  ) {}

  async createOneAdminUser(
    requestAdminUser: RequestAdminUser,
    createAdminRequest: CreateAdminRequestDto
  ): Promise<void> {
    // TODO @yashmurty : WIP
    // - Only creating with super admin role in payload works for now.
    console.log('requestAdminUser : ', requestAdminUser)
    console.log('createAdminRequest : ', createAdminRequest)

    // Check if an admin already exists with this email.
    const adminExists = await this.adminsRepository.findOneByEmail(createAdminRequest.email)
    if (adminExists) {
      throw new ConflictException('An admin with this email already exists')
    }

    // Start preparing the create admin object. It will be passed to the repo function.
    const createAdminDto: CreateAdminDto = new CreateAdminDto()
    createAdminDto.email = createAdminRequest.email
    createAdminDto.addedByAdminUserId = requestAdminUser.uid
    createAdminDto.addedByAdminEmail = requestAdminUser.email
    createAdminDto.userAdminRole = createAdminRequest.adminRole

    // Check if the user has access to create new user with desired adminRole in the payload.
    // Also, determine what accessKey will be added to the new created admin.
    switch (createAdminRequest.adminRole) {
      case AdminRole.superAdminRole:
        if (!canUserCreateSuperAdmin(requestAdminUser.userAccessKey)) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        createAdminDto.userAccessKey = getSuperAdminACLKey()
        break

      case AdminRole.nationalAdminRole:
        if (!canUserCreateNationalAdmin(requestAdminUser.userAccessKey)) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        throw new UnauthorizedException('WIP. nationalAdminRole not supported yet')

      case AdminRole.prefectureAdminRole:
        if (
          !canUserCreatePrefectureAdmin(
            requestAdminUser.userAccessKey,
            createAdminRequest.prefectureId
          )
        ) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        // Check if prefectureId is valid
        const isPrefectureCodeValid = await this.prefecturesService.isPrefectureCodeValid(
          createAdminRequest.prefectureId
        )
        if (!isPrefectureCodeValid) {
          throw new BadRequestException('Invalid prefectureId value')
        }

        throw new UnauthorizedException('WIP. prefectureAdminRole not supported yet')

      case AdminRole.organizationAdminRole:
        if (
          !canUserCreateOrganizationAdmin(
            requestAdminUser.userAccessKey,
            createAdminRequest.organizationId
          )
        ) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        // Check if organizationId is valid
        const isOrganizationCodeValid = await this.organizationsService.isOrganizationCodeValid(
          createAdminRequest.organizationId
        )
        if (!isOrganizationCodeValid) {
          throw new BadRequestException('Invalid organizationId value')
        }

        createAdminDto.userAccessKey = getOrganizationAdminACLKey(createAdminRequest.organizationId)
        createAdminDto.organizationId = createAdminRequest.organizationId
        break

      default:
        throw new BadRequestException('Invalid adminRole value')
    }

    let firebaseUserRecord: firebaseAdmin.auth.UserRecord
    try {
      firebaseUserRecord = await firebaseAdmin.auth().createUser({
        email: createAdminRequest.email,
        emailVerified: false,
        disabled: false,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    createAdminDto.adminUserId = firebaseUserRecord.uid

    console.log('createAdminDto : ', createAdminDto)

    return this.adminsRepository.createOne(createAdminDto)
  }

  async findOneAdminById(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOneById(adminId)
  }

  async findAllAdminUsers(): Promise<Admin[]> {
    return this.adminsRepository.findAll()
  }

  async deleteOneAdminById(adminId: string): Promise<void> {
    const admin = await this.adminsRepository.findOneById(adminId)
    // TODO @yashmurty :
    // Fetch admin and check for ACL. If okay, proceed to delete.
  }
}

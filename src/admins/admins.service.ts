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
import { AdminRole, canUserCreateSuperAdmin, getSuperAdminACLKey } from '../shared/acl'
import { RequestAdminUser } from '../shared/interfaces'

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

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

    let generatedUserAccessKey: string
    // Check if the user has access to create new user with desired adminRole in the payload.
    switch (createAdminRequest.adminRole) {
      case AdminRole.superAdminRole:
        if (!canUserCreateSuperAdmin(requestAdminUser.userAccessKey)) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        generatedUserAccessKey = getSuperAdminACLKey()
        break

      default:
        throw new UnauthorizedException('WIP. adminRole not supported yet')
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

    const createAdminDto: CreateAdminDto = new CreateAdminDto()
    createAdminDto.adminUserId = firebaseUserRecord.uid
    createAdminDto.email = createAdminRequest.email
    createAdminDto.addedByAdminUserId = requestAdminUser.uid
    createAdminDto.addedByAdminEmail = requestAdminUser.email
    createAdminDto.userAdminRole = createAdminRequest.adminRole
    createAdminDto.userAccessKey = generatedUserAccessKey

    console.log('createAdminDto : ', createAdminDto)

    return this.adminsRepository.createOne(createAdminDto)
  }

  async findOneAdminById(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOneById(adminId)
  }

  async findAllAdminUsers(): Promise<Admin[]> {
    return this.adminsRepository.findAll()
  }
}

import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminRequestDto } from './dto/create-admin.dto'
import { Admin } from './classes/admin.class'
import * as firebaseAdmin from 'firebase-admin'
import {
  AdminRole,
  canUserCreateSuperAdmin,
  getSuperAdminACLKey,
  canUserCreateNationalAdmin,
  canUserCreatePrefectureAdmin,
  getPrefectureAdminACLKey,
  getNationalAdminACLKey,
  canUserAccessResource,
} from '../shared/acl'
import { RequestAdminUser } from '../shared/interfaces'
import { PrefecturesService } from '../prefectures/prefectures.service'
import { FirebaseService } from '../shared/firebase/firebase.service'

@Injectable()
export class AdminsService {
  constructor(
    private adminsRepository: AdminsRepository,
    private prefecturesService: PrefecturesService,
    private firebaseService: FirebaseService
  ) {}

  async createOneAdminUser(
    requestAdminUser: RequestAdminUser,
    createAdminRequest: CreateAdminRequestDto
  ): Promise<void> {
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
    createAdminDto.accessControlList = [getSuperAdminACLKey()]
    // Check if the user has access to create new user with desired adminRole in the payload.
    // Also, determine what accessKey will be added to the new created admin.
    switch (createAdminRequest.adminRole) {
      case AdminRole.superAdminRole:
        if (!canUserCreateSuperAdmin(requestAdminUser.userAccessKey)) {
          throw new UnauthorizedException('Insufficient access to create this adminRole')
        }
        createAdminDto.userAccessKey = getSuperAdminACLKey()
        // No need to add any ACL Key in accessControlList, since it already contains the
        // superAdmin key added above.
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

        createAdminDto.userAccessKey = getPrefectureAdminACLKey(createAdminRequest.prefectureId)
        createAdminDto.prefectureId = createAdminRequest.prefectureId
        createAdminDto.accessControlList.push(
          getNationalAdminACLKey(),
          getPrefectureAdminACLKey(createAdminRequest.prefectureId)
        )

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

    return this.adminsRepository.createOne(createAdminDto)
  }

  async getOneAdminById(requestAdminUser: RequestAdminUser, adminId: string): Promise<Admin> {
    // Fetch resource and perform ACL check.
    const admin = await this.adminsRepository.findOneById(adminId)
    if (!admin) {
      throw new NotFoundException('Could not find admin with this id')
    }
    if (!canUserAccessResource(requestAdminUser.userAccessKey, admin)) {
      throw new UnauthorizedException('User does not have access on this resource')
    }

    return admin
  }

  /**
   * Fetches one admin by adminId.
   * Internal functions do not perform any ACL checks and should be used carefully.
   * @param adminId: string
   */
  async findOneAdminByIdInternal(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOneById(adminId)
  }

  async findAllAdminUsers(
    requestAdminUser: RequestAdminUser,
    limit: number,
    offset: number
  ): Promise<Admin[]> {
    // ACL check is automatically performed in the repository function.
    return this.adminsRepository.findAll(requestAdminUser.userAccessKey, limit, offset)
  }

  async deleteOneAdminById(requestAdminUser: RequestAdminUser, adminId: string): Promise<void> {
    // Fetch resource and perform ACL check. Check performed within the called function.
    await this.getOneAdminById(requestAdminUser, adminId)

    // Delete admin in Firestore admins collection.
    await this.adminsRepository.deleteOneById(adminId)
    // Delete admin in Firebase auth.
    await this.firebaseService.DeleteFirebaseUser(adminId)
  }
}

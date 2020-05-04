import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AdminsService } from '../admins/admins.service'
import { CreateUserDto, CreateUserProfileDto } from '../users/dto/create-user.dto'
import { validateOrReject } from 'class-validator'
import { LoginNormalUserRequestDto } from './dto/login-normal-user.dto'
import { FirebaseService } from '../shared/firebase/firebase.service'
import { RequestAdminUser } from '../shared/interfaces'
import { Admin } from '../admins/classes/admin.class'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private adminsService: AdminsService,
    private firebaseService: FirebaseService
  ) {}

  async normalUserLogin(
    userDecodedToken: any,
    loginNormalUserRequestDto: LoginNormalUserRequestDto
  ): Promise<void> {
    const userObj = await this.usersService.findOneUserById(userDecodedToken.uid)
    if (!userObj) {
      await this.createFirstTimeLoginUser(userDecodedToken, loginNormalUserRequestDto)
    }

    // If custom claim does not exist, then add it because above validation has passed.
    if (!userDecodedToken.isNormalUser) {
      await this.firebaseService.UpsertCustomClaims(userDecodedToken.uid, { isNormalUser: true })
    }
  }

  async adminUserlogin(requestAdminUser: RequestAdminUser): Promise<void> {
    const adminObj = await this.adminsService.findOneAdminById(requestAdminUser.uid)
    if (!adminObj) {
      throw new ForbiddenException('User Id does not belong to an admin')
    }
    if (adminObj.email !== requestAdminUser.email) {
      throw new ForbiddenException('Email in access token does not match with admin in firestore')
    }

    // If custom claim does not exist, then add it because above validation has passed.
    await this.upsertAdminCustomClaims(requestAdminUser, adminObj)
  }

  /**
   * Create a user document in firestore for first time user.
   * @param userDecodedToken: any
   */
  private async createFirstTimeLoginUser(
    userDecodedToken: any,
    loginNormalUserRequestDto: LoginNormalUserRequestDto
  ): Promise<void> {
    const createUserDto: CreateUserDto = new CreateUserDto()
    createUserDto.userId = userDecodedToken.uid
    // Validate the create User data object which will be saved to firestore.
    try {
      await validateOrReject(createUserDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    const createUserProfileDto: CreateUserProfileDto = new CreateUserProfileDto()
    createUserProfileDto.prefecture = loginNormalUserRequestDto.prefecture

    await this.usersService.createOneUser(createUserDto, createUserProfileDto)
  }

  /**
   * Upsert admin custom claims to JWT if they don't already exist.
   * Also validate if the admin role and key exist in the firestore entry.
   * @param requestAdminUser: RequestAdminUser
   * @param admin: Admin
   */
  private async upsertAdminCustomClaims(
    requestAdminUser: RequestAdminUser,
    admin: Admin
  ): Promise<void> {
    if (!admin.userAdminRole || !admin.userAccessKey) {
      throw new ForbiddenException('Admin in firestore does not have role and access')
    }

    if (
      !requestAdminUser.isAdminUser ||
      !requestAdminUser.userAdminRole ||
      !requestAdminUser.userAccessKey
    ) {
      await this.firebaseService.UpsertCustomClaims(requestAdminUser.uid, {
        isAdminUser: true,
        userAdminRole: admin.userAdminRole,
        userAccessKey: admin.userAccessKey,
      })
    }
  }
}

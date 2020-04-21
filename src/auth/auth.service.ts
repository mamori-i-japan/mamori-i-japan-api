import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AdminsService } from '../admins/admins.service'
import { CreateUserDto, CreateUserProfileDto } from '../users/dto/create-user.dto'
import { validateOrReject } from 'class-validator'
import * as firebaseAdmin from 'firebase-admin'
import { validateNormalTokenPhonePayload } from './util'
import { LoginNormalUserRequestDto } from './dto/login-normal-user.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private adminsService: AdminsService) {}

  async normalUserLogin(
    userDecodedToken: any,
    loginNormalUserRequestDto: LoginNormalUserRequestDto
  ) {
    const userObj = await this.usersService.findOneUserById(userDecodedToken.uid)
    if (!userObj) {
      await this.createFirstTimeLoginUser(userDecodedToken, loginNormalUserRequestDto)
    }

    // Remove the phone number from the linked firebase auth user.
    await firebaseAdmin.auth().updateUser(userDecodedToken.uid, {
      phoneNumber: null,
      disabled: false,
    })

    await firebaseAdmin.auth().setCustomUserClaims(userDecodedToken.uid, { isNormalUser: true })

    const updatedUser = await firebaseAdmin.auth().getUser(userDecodedToken.uid)

    return updatedUser
  }

  async adminUserlogin(userDecodedToken: any) {
    console.log('userDecodedToken : ', userDecodedToken)
    const adminObj = await this.adminsService.findOneAdminById(userDecodedToken.uid)
    if (!adminObj) {
      throw new ForbiddenException('User Id does not belong to an admin')
    }
    if (adminObj.email !== userDecodedToken.email) {
      throw new ForbiddenException('Email in access token does not match with admin in firestore')
    }

    await firebaseAdmin.auth().setCustomUserClaims(userDecodedToken.uid, { isAdminUser: true })

    return userDecodedToken
  }

  /**
   * Create a user document in firestore for first time user.
   * @param userDecodedToken: any
   */
  private async createFirstTimeLoginUser(
    userDecodedToken: any,
    loginNormalUserRequestDto: LoginNormalUserRequestDto
  ) {
    // Expect all normal access tokens (FDT) to have phone_number data.
    validateNormalTokenPhonePayload(userDecodedToken)

    const createUserDto: CreateUserDto = new CreateUserDto()
    createUserDto.userId = userDecodedToken.uid
    createUserDto.phoneNumber = userDecodedToken.phone_number
    // Validate the create User data object which will be saved to firestore.
    try {
      await validateOrReject(createUserDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    const createUserProfileDto: CreateUserProfileDto = new CreateUserProfileDto()
    createUserProfileDto.prefecture = loginNormalUserRequestDto.prefecture
    createUserProfileDto.job = loginNormalUserRequestDto.job

    await this.usersService.createOneUser(createUserDto, createUserProfileDto)
  }
}

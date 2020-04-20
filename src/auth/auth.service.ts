import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AdminsService } from '../admins/admins.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { validateOrReject } from 'class-validator'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private adminsService: AdminsService) {}

  async normalUserLogin(userDecodedToken: any) {
    const userObj = await this.usersService.findOneUserById(userDecodedToken.uid)
    if (!userObj) {
      await this.createFirstTimeLoginUser(userDecodedToken, userDecodedToken.phone_number)
    }

    // Remove the phone number from the linked firebase auth user.
    await firebaseAdmin.auth().updateUser(userDecodedToken.uid, {
      phoneNumber: null,
      disabled: false,
    })

    await firebaseAdmin.auth().setCustomUserClaims(userDecodedToken.uid, { isNormalUser: true })

    return userDecodedToken
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
   * @param phoneNumber: string
   */
  private async createFirstTimeLoginUser(userDecodedToken: any, phoneNumber: string) {
    const createUserDto: CreateUserDto = new CreateUserDto()
    createUserDto.userId = userDecodedToken.uid
    createUserDto.phoneNumber = phoneNumber
    // Validate the create User data object which will be saved to firestore.
    try {
      await validateOrReject(createUserDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    await this.usersService.createOneUser(createUserDto)
  }
}

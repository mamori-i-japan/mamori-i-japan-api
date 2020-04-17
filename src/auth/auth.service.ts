import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AdminsService } from '../admins/admins.service'
import { User } from '../users/interfaces/user.interface'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { validateOrReject } from 'class-validator'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private adminsService: AdminsService) {}

  async normalUserLogin(userDecodedToken: any, secretRandomToken: string) {
    const userObj = await this.usersService.findOneUserById(userDecodedToken.uid)
    if (!userObj) {
      await this.createFirstTimeLoginUser(userDecodedToken, secretRandomToken)
    } else {
      await this.verifySecretRandomToken(userObj, secretRandomToken)
    }

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
   * @param secretRandomToken: string
   */
  private async createFirstTimeLoginUser(userDecodedToken: any, secretRandomToken: string) {
    const createUserDto: CreateUserDto = new CreateUserDto()
    createUserDto.userId = userDecodedToken.uid
    createUserDto.secretRandomToken = secretRandomToken
    // Validate the create User data object which will be saved to firestore.
    try {
      await validateOrReject(createUserDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    await this.usersService.createOneUser(createUserDto)
  }

  /**
   * Verify if the secret random token matches the one for existing user.
   * @param userObj: User
   * @param secretRandomToken: string
   */
  private async verifySecretRandomToken(userObj: User, secretRandomToken: string) {
    if (userObj.secretRandomToken !== secretRandomToken) {
      // TODO @yashmurty :
      // Later on this behavior should be
      // 1. Revoke access token for this uid.
      // 2. Delete existing user with this uid.
      // 3. Create new user with new uid for this phone number.
      throw new ForbiddenException('Secret random token does not match with existing one')
    }
  }
}

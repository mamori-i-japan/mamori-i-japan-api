import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { User } from '../users/interfaces/user.interface'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { validateOrReject } from 'class-validator'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(userDecodedToken: any, secretRandomToken: string) {
    // await firebaseAdmin
    //   .auth()
    //   .setCustomUserClaims(user.uid, { isAdminUser: false, isNormalUser: true })

    // const updatedUser = await firebaseAdmin.auth().getUser(user.uid)

    // 1. Fetch users firestore and see if users exists.
    // 2. If user exists, check if secret_random_token matches and return 200,
    // otherwise throw error (also force set isNormalUser claim again?).
    // 3. If user does not exist, create new one and also save secret_random_token,
    // and add custom claim of isNormalUser.

    const userObj = await this.usersService.findOne(userDecodedToken.uid)
    if (!userObj) {
      await this.createFirstTimeLoginUser(userDecodedToken, secretRandomToken)
    } else {
      await this.verifySecretRandomToken(userObj, secretRandomToken)
    }

    return userDecodedToken
  }

  async createFirstTimeLoginUser(userDecodedToken: any, secretRandomToken: string) {
    const createUserDto: CreateUserDto = new CreateUserDto()
    createUserDto.userId = userDecodedToken.uid
    createUserDto.secretRandomToken = secretRandomToken
    try {
      await validateOrReject(createUserDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    await this.usersService.create(createUserDto)
  }

  async verifySecretRandomToken(userObj: User, secretRandomToken: string) {
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

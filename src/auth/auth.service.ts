import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(userDecodedToken: any) {
    // await firebaseAdmin
    //   .auth()
    //   .setCustomUserClaims(user.uid, { isAdminUser: false, isNormalUser: true })

    // const updatedUser = await firebaseAdmin.auth().getUser(user.uid)

    // 1. Fetch users firestore and see if users exists.
    // 2. If user exists, check if secret_random_token matches and return 200,
    // otherwise throw error (also force set isNormalUser claim again?).
    // 3. If user does not exist, create new one and also save secret_random_token,
    // and add custom claim of isNormalUser.

    const user = await this.usersService.findOne(userDecodedToken.uid)
    console.log('user : ', user)

    if (!user) {
      await this.createFirstTimeUser(userDecodedToken)
    } else {
      await this.verifySecretRandomToken(userDecodedToken)
    }

    return userDecodedToken
  }

  async createFirstTimeUser(userDecodedToken: any) {
    console.log('userDecodedToken : ', userDecodedToken)
  }

  async verifySecretRandomToken(userDecodedToken: any) {
    console.log('userDecodedToken : ', userDecodedToken)
  }
}

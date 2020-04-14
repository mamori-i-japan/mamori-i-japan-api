import { Strategy, VerifiedCallback } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class FirebaseNormalUserLoginStrategy extends PassportStrategy(
  Strategy,
  'firebase-normal-user-login'
) {
  async validate(req: Request, done: VerifiedCallback): Promise<any> {
    const extractorFunction = ExtractJwt.fromAuthHeaderAsBearerToken()
    const token = extractorFunction(req)
    if (!token) {
      throw new UnauthorizedException('No bearer token found in the header')
    }

    let user: firebaseAdmin.auth.DecodedIdToken
    try {
      user = await firebaseAdmin.auth().verifyIdToken(token)
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    await firebaseAdmin
      .auth()
      .setCustomUserClaims(user.uid, { isAdminUser: false, isNormalUser: true })

    const updatedUser = await firebaseAdmin.auth().getUser(user.uid)

    done(null, updatedUser)
  }
}

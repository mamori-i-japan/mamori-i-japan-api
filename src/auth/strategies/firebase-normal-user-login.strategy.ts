import { Strategy, VerifiedCallback } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { X_MOBILE_SECRET_RANDOM_TOKEN_HEADER } from '../constants'

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

    if (!req.headers[X_MOBILE_SECRET_RANDOM_TOKEN_HEADER]) {
      throw new UnauthorizedException('No x-mobile-secret-random-token found in the header')
    }

    let userDecodedToken: firebaseAdmin.auth.DecodedIdToken
    try {
      userDecodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    console.log('userDecodedToken : ', userDecodedToken)

    // NOTE : Passport automatically creates a user object, based on the value we return here.
    done(null, userDecodedToken)
  }
}

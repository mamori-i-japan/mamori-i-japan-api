import { Strategy, VerifiedCallback } from 'passport-custom'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import * as firebaseAdmin from 'firebase-admin'
import { validateNormalTokenAnonymousPayload } from '../util'

@Injectable()
export class FirebaseNormalUserOrgValidateStrategy extends PassportStrategy(
  Strategy,
  'firebase-normal-user-org-validate'
) {
  async validate(req: Request, done: VerifiedCallback): Promise<any> {
    const extractorFunction = ExtractJwt.fromAuthHeaderAsBearerToken()
    const token = extractorFunction(req)
    if (!token) {
      throw new UnauthorizedException('No bearer token found in the header')
    }

    let userDecodedToken: firebaseAdmin.auth.DecodedIdToken
    try {
      userDecodedToken = await firebaseAdmin.auth().verifyIdToken(token)
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }

    // Expect all normal access tokens (FDT) to have provider id anonymous data.
    validateNormalTokenAnonymousPayload(userDecodedToken)

    // Check organizationCode custom claim.
    if (!userDecodedToken.organizationCode) {
      throw new UnauthorizedException('Access token does not contain custom claim organizationCode')
    }

    done(null, userDecodedToken)
  }
}

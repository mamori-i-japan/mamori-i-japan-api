import { UnauthorizedException } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'

/**
 * Validate admin access tokens to have email and email_verified data
 * @param userDecodedToken: firebaseAdmin.auth.DecodedIdToken
 */
export function validateAdminTokenEmailPayload(
  userDecodedToken: firebaseAdmin.auth.DecodedIdToken
) {
  if (!userDecodedToken.email) {
    throw new UnauthorizedException('Access token does not have email payload')
  }
  if (!userDecodedToken.email_verified) {
    throw new UnauthorizedException('Access token states email had not been verified yet')
  }
}

/**
 * Validate normal access tokens to have phone and phone_verified data
 * @param userDecodedToken: firebaseAdmin.auth.DecodedIdToken
 */
export function validateNormalTokenPhonePayload(
  userDecodedToken: firebaseAdmin.auth.DecodedIdToken
) {
  if (!userDecodedToken.phone_number) {
    throw new UnauthorizedException('Access token does not have phone number payload')
  }
}

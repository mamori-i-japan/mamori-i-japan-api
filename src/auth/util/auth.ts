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
 * Validate admin access tokens to have isAdminUser, userAdminRole and userAccessKey data
 * @param userDecodedToken: firebaseAdmin.auth.DecodedIdToken
 */
export function validateAdminTokenCustomClaims(
  userDecodedToken: firebaseAdmin.auth.DecodedIdToken
) {
  if (!userDecodedToken.isAdminUser) {
    throw new UnauthorizedException('Access token does not have isAdminUser payload')
  }
  if (!userDecodedToken.userAdminRole) {
    throw new UnauthorizedException('Access token does not have userAdminRole payload')
  }
  if (!userDecodedToken.userAccessKey) {
    throw new UnauthorizedException('Access token does not have userAccessKey payload')
  }
}

/**
 * Validate normal access tokens to have provider_id data as anonymous.
 * @param userDecodedToken: firebaseAdmin.auth.DecodedIdToken
 */
export function validateNormalTokenAnonymousPayload(
  userDecodedToken: firebaseAdmin.auth.DecodedIdToken
) {
  if (userDecodedToken.provider_id !== 'anonymous') {
    throw new UnauthorizedException('Access token does not have provider_id anonymous payload')
  }
}

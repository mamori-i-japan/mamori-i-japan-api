import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseNormalUserOrgValidateGuard extends AuthGuard(
  'firebase-normal-user-org-validate'
) {}

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseAdminUserValidateGuard extends AuthGuard('firebase-admin-user-validate') {}

import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseAdminUserLoginGuard extends AuthGuard('firebase-admin-user-login') {}

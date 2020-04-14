import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseNormalUserLoginGuard extends AuthGuard('firebase-normal-user-login') {}

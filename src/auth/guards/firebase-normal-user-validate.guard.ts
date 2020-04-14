import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class FirebaseNormalUserValidateGuard extends AuthGuard('firebase-normal-user-validate') {}

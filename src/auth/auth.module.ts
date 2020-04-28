import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FirebaseNormalUserLoginStrategy } from './strategies/firebase-normal-user-login.strategy'
import { UsersModule } from '../users/users.module'
import { FirebaseNormalUserValidateStrategy } from './strategies/firebase-normal-user-validate.strategy'
import { AuthController } from './auth.controller'
import { SharedModule } from '../shared/shared.module'
import { FirebaseAdminUserLoginStrategy } from './strategies/firebase-admin-user-login.strategy'
import { FirebaseAdminUserValidateStrategy } from './strategies/firebase-admin-user-validate.strategy'
import { AdminsModule } from '../admins/admins.module'
import { FirebaseNormalUserOrgValidateStrategy } from './strategies/firebase-normal-user-org-validate.strategy'

@Module({
  imports: [AdminsModule, UsersModule, SharedModule],
  providers: [
    AuthService,
    FirebaseNormalUserLoginStrategy,
    FirebaseNormalUserValidateStrategy,
    FirebaseNormalUserOrgValidateStrategy,
    FirebaseAdminUserLoginStrategy,
    FirebaseAdminUserValidateStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

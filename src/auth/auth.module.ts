import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FirebaseNormalUserLoginStrategy } from './strategies/firebase-normal-user-login.strategy'
import { UsersModule } from '../users/users.module'
import { FirebaseNormalUserValidateStrategy } from './strategies/firebase-normal-user-validate.strategy'
import { AuthController } from './auth.controller'
import { FirebaseModule } from '../firebase/firebase.module'

@Module({
  imports: [UsersModule, FirebaseModule],
  providers: [AuthService, FirebaseNormalUserLoginStrategy, FirebaseNormalUserValidateStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

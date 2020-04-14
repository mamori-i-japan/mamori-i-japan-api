import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { FirebaseNormalUserLoginStrategy } from './strategies/firebase-normal-user-login.strategy'
import { UsersModule } from '../users/users.module'
import { FirebaseNormalUserValidateStrategy } from './strategies/firebase-normal-user-validate.strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [UsersModule],
  providers: [AuthService, FirebaseNormalUserLoginStrategy, FirebaseNormalUserValidateStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

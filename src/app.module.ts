import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from './config/module-options'
import { CatsController } from './cats/cats.controller'
import { CatsService } from './cats/cats.service'

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot(configModuleOptions)],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { SharedModule } from './shared/shared.module'
import { AdminsModule } from './admins/admins.module'
import { OrganizationsModule } from './organizations/organizations.module'
import { PrefecturesModule } from './prefectures/prefectures.module'

@Module({
  imports: [
    AdminsModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    PrefecturesModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

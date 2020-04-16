import { Module } from '@nestjs/common'
import { AdminsService } from './admins.service'
import { AdminsRepository } from './admins.repository'
import { FirebaseModule } from '../firebase/firebase.module'
import { AdminsController } from './admins.controller'

@Module({
  imports: [FirebaseModule],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from '../shared/config/module-options'
import { FirebaseModule } from './firebase/firebase.module'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), FirebaseModule, LoggerModule],
  providers: [],
  exports: [ConfigModule, FirebaseModule, LoggerModule],
})
export class SharedModule {}

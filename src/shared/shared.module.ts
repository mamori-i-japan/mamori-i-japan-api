import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from '../shared/config/module-options'
import { FirebaseModule } from './firebase/firebase.module'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), FirebaseModule],
  providers: [],
  exports: [ConfigModule, FirebaseModule],
})
export class SharedModule {}

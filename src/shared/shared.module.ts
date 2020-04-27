import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configModuleOptions } from '../shared/config/module-options'
import { FirebaseModule } from './firebase/firebase.module'
import { LoggerModule } from './logger/logger.module'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), FirebaseModule, LoggerModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
  exports: [ConfigModule, FirebaseModule, LoggerModule],
})
export class SharedModule {}

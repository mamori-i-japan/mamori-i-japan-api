import { Module } from '@nestjs/common'
import { PrefecturesService } from './prefectures.service'
import { PrefecturesRepository } from './prefectures.repository'
import { SharedModule } from '../shared/shared.module'
import { PrefecturesController } from './prefectures.controller'

@Module({
  imports: [SharedModule],
  providers: [PrefecturesService, PrefecturesRepository],
  exports: [PrefecturesService],
  controllers: [PrefecturesController],
})
export class PrefecturesModule {}

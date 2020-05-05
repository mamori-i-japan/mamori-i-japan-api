import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Request,
  HttpCode,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'
import { Prefecture } from './classes/prefecture.class'
import { CreatePrefectureRequestDto, UpdatePrefectureRequestDto } from './dto/create-prefecture.dto'
import { PrefecturesService } from './prefectures.service'
import { RequestAdminUser } from '../shared/interfaces'

@ApiTags('prefecture')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseAdminUserValidateGuard)
@UseInterceptors(CreatedResponseInterceptor)
@Controller('admins')
export class PrefecturesController {
  constructor(private prefecturesService: PrefecturesService) {}

  @ApiOperation({ summary: 'Get all prefectures' })
  @ApiOkResponse({ type: [Prefecture] })
  @Get('/prefectures')
  async getPrefectures(@Request() req): Promise<Prefecture[]> {
    const requestAdminUser: RequestAdminUser = req.user

    return this.prefecturesService.findAllPrefectures(requestAdminUser)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new organziation' })
  @ApiOkResponse({ type: Prefecture })
  @ApiBadRequestResponse()
  @Post('/prefectures')
  @HttpCode(200)
  async postPrefecture(
    @Request() req,
    @Body() createPrefectureRequest: CreatePrefectureRequestDto
  ): Promise<Prefecture> {
    const requestAdminUser: RequestAdminUser = req.user

    return this.prefecturesService.createOnePrefecture(requestAdminUser, createPrefectureRequest)
  }

  @ApiOperation({ summary: 'Get prefecture by id' })
  @ApiOkResponse({ type: Prefecture })
  @Get('/prefectures/:prefectureId')
  async getPrefectureById(
    @Request() req,
    @Param('prefectureId') prefectureId: number
  ): Promise<Prefecture> {
    const requestAdminUser: RequestAdminUser = req.user
    const prefecture = await this.prefecturesService.findOnePrefectureById(
      requestAdminUser,
      prefectureId
    )

    return prefecture
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Update prefecture' })
  @ApiOkResponse({ type: CreatedResponse })
  @Patch('/prefectures/:prefectureId')
  async patchMeProfile(
    @Request() req,
    @Param('prefectureId') prefectureId: number,
    @Body() updatePrefectureRequest: UpdatePrefectureRequestDto
  ): Promise<CreatedResponse> {
    const requestAdminUser: RequestAdminUser = req.user
    updatePrefectureRequest.prefectureId = prefectureId

    await this.prefecturesService.updateOnePrefecture(requestAdminUser, updatePrefectureRequest)

    return {}
  }
}

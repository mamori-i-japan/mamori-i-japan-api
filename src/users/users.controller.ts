import {
  Controller,
  Get,
  Post,
  Patch,
  Request,
  UseGuards,
  UsePipes,
  UseInterceptors,
  ValidationPipe,
  Body,
  HttpCode,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { FirebaseNormalUserValidateGuard } from '../auth/guards/firebase-normal-user-validate.guard'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { UpdateUserProfileDto } from './dto/create-user.dto'
import { CreateDiagnosisKeysDto } from './dto/create-diagnosis-keys.dto'
import { NoResponseBodyInterceptor } from '../shared/interceptors/no-response-body.interceptor'
import { NoResponseBody } from '../shared/classes/no-response-body.class'
import { UserProfile } from './classes/user.class'

@ApiTags('app')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseNormalUserValidateGuard)
@UseInterceptors(NoResponseBodyInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ type: UserProfile })
  @Get('/me/profile')
  async getMeProfile(@Request() req): Promise<UserProfile> {
    const userId = req.user.uid
    return this.usersService.findOneUserProfileById(userId)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ type: NoResponseBody })
  @Patch('/me/profile')
  async patchMeProfile(
    @Request() req,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ): Promise<void> {
    updateUserProfileDto.userId = req.user.uid
    return this.usersService.updateUserProfile(updateUserProfileDto)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Give the user a positive flag by health-center-token' })
  @ApiOkResponse({ type: NoResponseBody })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Post('/me/health_center_tokens')
  @HttpCode(200)
  async createDiagnosisKeys(
    @Request() req,
    @Body() createDiagnosisKeys: CreateDiagnosisKeysDto
  ): Promise<NoResponseBody> {
    await this.usersService.createDiagnosisKeys(createDiagnosisKeys)
    return {}
  }
}

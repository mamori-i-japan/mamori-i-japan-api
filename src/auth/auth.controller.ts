import {
  Controller,
  Post,
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
} from '@nestjs/swagger'
import { FirebaseNormalUserLoginGuard } from './guards/firebase-normal-user-login.guard'
import { AuthService } from './auth.service'
import { FirebaseAdminUserLoginGuard } from './guards/firebase-admin-user-login.guard'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { LoginNormalUserRequestDto } from './dto/login-normal-user.dto'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'

@ApiTags('auth')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseInterceptors(CreatedResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiOkResponse({ type: CreatedResponse })
  @ApiBadRequestResponse()
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  @HttpCode(200)
  async loginFirebase(
    @Request() req,
    @Body() loginNormalUserRequestDto: LoginNormalUserRequestDto
  ): Promise<CreatedResponse> {
    await this.authService.normalUserLogin(req.user, loginNormalUserRequestDto)
    return {}
  }

  @ApiOperation({ summary: 'Login endpoint for admin user' })
  @ApiOkResponse({ type: CreatedResponse })
  @ApiBadRequestResponse()
  @UseGuards(FirebaseAdminUserLoginGuard)
  @Post('admin/login')
  @HttpCode(200)
  async adminUserLoginFirebase(@Request() req): Promise<CreatedResponse> {
    await this.authService.adminUserlogin(req.user)
    return {}
  }
}

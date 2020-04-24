import {
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  UseInterceptors,
  ValidationPipe,
  Body,
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
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { LoginNormalUserRequestDto } from './dto/login-normal-user.dto'
import { CreatedResponseInterceptor } from '../shared/created-response.interceptor'

@ApiTags('auth')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseInterceptors(CreatedResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(
    @Request() req,
    @Body() loginNormalUserRequestDto: LoginNormalUserRequestDto
  ): Promise<void> {
    return this.authService.normalUserLogin(req.user, loginNormalUserRequestDto)
  }

  @ApiOperation({ summary: 'Login endpoint for admin user' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(FirebaseAdminUserLoginGuard)
  @Post('admin/login')
  async adminUserLoginFirebase(@Request() req): Promise<void> {
    return this.authService.adminUserlogin(req.user)
  }
}

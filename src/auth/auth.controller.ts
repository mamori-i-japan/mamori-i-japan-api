import {
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger'
import { FirebaseNormalUserLoginGuard } from './guards/firebase-normal-user-login.guard'
import { AuthService } from './auth.service'
import { FirebaseAdminUserLoginGuard } from './guards/firebase-admin-user-login.guard'
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { LoginNormalUserRequestDto } from './dto/login-normal-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(
    @Request() req,
    @Body() loginNormalUserRequestDto: LoginNormalUserRequestDto
  ) {
    return this.authService.normalUserLogin(req.user, loginNormalUserRequestDto)
  }

  @ApiOperation({ summary: 'Login endpoint for admin user' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseAdminUserLoginGuard)
  @Post('admin/login')
  async adminUserLoginFirebase(@Request() req) {
    return this.authService.adminUserlogin(req.user)
  }
}

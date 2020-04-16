import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNoContentResponse,
} from '@nestjs/swagger'
import { FirebaseNormalUserLoginGuard } from './guards/firebase-normal-user-login.guard'
import { AuthService } from './auth.service'
import { X_MOBILE_SECRET_RANDOM_TOKEN_HEADER } from './constants'
import { FirebaseAdminUserLoginGuard } from './guards/firebase-admin-user-login.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: X_MOBILE_SECRET_RANDOM_TOKEN_HEADER,
    description: 'Secret Random Token associated with the physical mobile device',
    required: true,
  })
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(@Request() req) {
    return this.authService.normalUserLogin(
      req.user,
      req.headers[X_MOBILE_SECRET_RANDOM_TOKEN_HEADER]
    )
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

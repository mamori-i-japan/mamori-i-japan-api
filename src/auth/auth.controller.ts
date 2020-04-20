import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger'
import { FirebaseNormalUserLoginGuard } from './guards/firebase-normal-user-login.guard'
import { AuthService } from './auth.service'
import { FirebaseAdminUserLoginGuard } from './guards/firebase-admin-user-login.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(@Request() req) {
    return this.authService.normalUserLogin(req.user)
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

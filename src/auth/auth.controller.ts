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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'x-mobile-secret-random-token',
    description: 'Secret Random Token associated with the physical mobile device',
  })
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(@Request() req) {
    console.log('headers : ', req.headers)
    return this.authService.login(req.user)
  }
}

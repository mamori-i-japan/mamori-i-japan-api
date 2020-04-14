import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiNoContentResponse,
} from '@nestjs/swagger'
import { FirebaseNormalUserLoginGuard } from './guards/firebase-normal-user-login.guard'

@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Login endpoint for normal user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'X-Mobile-Secret-Random-Token',
    description: 'Secret Random Token associated with the physical mobile device',
  })
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Post('login')
  async loginFirebase(@Request() req) {
    return req.user
  }
}

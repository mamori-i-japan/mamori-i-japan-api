import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { TempID } from './interfaces/temp-id.interface'
import { FirebaseNormalUserLoginGuard } from '../auth/guards/firebase-normal-user-login.guard'
import { X_MOBILE_SECRET_RANDOM_TOKEN_HEADER } from '../auth/constants'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Find users' own TempIDs" })
  @ApiBearerAuth()
  @ApiHeader({ name: X_MOBILE_SECRET_RANDOM_TOKEN_HEADER, required: true })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseNormalUserLoginGuard)
  @Get('/me/temp_ids')
  async getMeTempIDs(@Request() req): Promise<TempID[]> {
    const userId = req.user.uid
    return this.usersService.getTempIDs(userId)
  }
}

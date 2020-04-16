import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { TempID } from './interfaces/temp-id.interface'
import { FirebaseNormalUserValidateGuard } from '../auth/guards/firebase-normal-user-validate.guard'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Find users' own TempIDs" })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseNormalUserValidateGuard)
  @Get('/me/temp_ids')
  async getMeTempIDs(@Request() req): Promise<TempID[]> {
    const userId = req.user.uid
    return this.usersService.getTempIDs(userId)
  }
}

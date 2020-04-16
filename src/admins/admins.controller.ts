import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AdminsService } from './admins.service'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'

@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @ApiOperation({ summary: 'Get admin profile' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseAdminUserValidateGuard)
  @Get('/profile')
  async getMeTempIDs(@Request() req) {
    return req.user
  }
}

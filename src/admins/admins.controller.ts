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
  @Get('/users')
  async getAdminUsers(@Request() req) {
    return this.adminsService.findAllAdminUsers()
  }
}

import { Controller, Get, Request, UseGuards, Post } from '@nestjs/common'
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

  // TODO @yashmurty : Investigate pagination for this later.
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseAdminUserValidateGuard)
  @Get('/users')
  async getAdminUsers() {
    return this.adminsService.findAllAdminUsers()
  }

  @ApiOperation({ summary: 'Create new admin user' })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseAdminUserValidateGuard)
  @Post('/users')
  async postAdminUser() {
    return 'WIP'
  }
}

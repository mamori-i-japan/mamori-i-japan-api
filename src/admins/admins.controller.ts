import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { AdminsService } from './admins.service'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { CreateAdminRequestDto } from './dto/create-admin.dto'
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'

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

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new admin user' })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseAdminUserValidateGuard)
  @Post('/users')
  async postAdminUser(@Request() req, @Body() createAdminRequest: CreateAdminRequestDto) {
    createAdminRequest.addedByAdminUserId = req.user.uid
    createAdminRequest.addedByAdminEmail = req.user.email
    return this.adminsService.createOneAdminUser(createAdminRequest)
  }
}

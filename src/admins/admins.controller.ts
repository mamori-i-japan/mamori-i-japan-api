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
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { AdminsService } from './admins.service'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { CreateAdminRequestDto, SetPositiveFlagDto } from './dto/create-admin.dto'
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { Admin } from './interfaces/admin.interface'

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseAdminUserValidateGuard)
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  // TODO @yashmurty : Investigate pagination for this later.
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiOkResponse({ type: [Admin] })
  @Get('/users')
  async getAdminUsers(): Promise<Admin[]> {
    return this.adminsService.findAllAdminUsers()
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new admin user' })
  @ApiCreatedResponse()
  @Post('/users')
  async postAdminUser(@Request() req, @Body() createAdminRequest: CreateAdminRequestDto) {
    createAdminRequest.addedByAdminUserId = req.user.uid
    createAdminRequest.addedByAdminEmail = req.user.email
    return this.adminsService.createOneAdminUser(createAdminRequest)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Give the user a positive flag' })
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @Post('/positives')
  async setPositiveFlag(@Body() setPositiveFlag: SetPositiveFlagDto) {
    return this.adminsService.setPositiveFlag(setPositiveFlag)
  }
}

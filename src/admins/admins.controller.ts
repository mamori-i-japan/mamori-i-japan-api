import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Request,
  HttpCode,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { AdminsService } from './admins.service'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { CreateAdminRequestDto } from './dto/create-admin.dto'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { Admin } from './classes/admin.class'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseAdminUserValidateGuard)
@UseInterceptors(CreatedResponseInterceptor)
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
  @ApiOkResponse({ type: CreatedResponse })
  @ApiBadRequestResponse()
  @Post('/users')
  @HttpCode(200)
  async postAdminUser(
    @Request() req,
    @Body() createAdminRequest: CreateAdminRequestDto
  ): Promise<CreatedResponse> {
    createAdminRequest.addedByAdminUserId = req.user.uid
    createAdminRequest.addedByAdminEmail = req.user.email
    await this.adminsService.createOneAdminUser(createAdminRequest)
    return {}
  }
}

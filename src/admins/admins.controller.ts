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
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { AdminsService } from './admins.service'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { CreateAdminRequestDto } from './dto/create-admin.dto'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { Admin } from './classes/admin.class'
import { NoResponseBodyInterceptor } from '../shared/interceptors/no-response-body.interceptor'
import { NoResponseBody } from '../shared/classes/no-response-body.class'
import { RequestAdminUser } from '../shared/interfaces'
import { PaginationParamsDto } from 'src/shared/classes/pagination-params.class'

@ApiTags('admin')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseAdminUserValidateGuard)
@UseInterceptors(NoResponseBodyInterceptor)
@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  // TODO @yashmurty : Investigate pagination for this later.
  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiOkResponse({ type: [Admin] })
  @Get('/users')
  async getAdminUsers(@Request() req, @Query() query: PaginationParamsDto): Promise<Admin[]> {
    const requestAdminUser: RequestAdminUser = req.user

    return this.adminsService.findAllAdminUsers(requestAdminUser)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new admin user' })
  @ApiOkResponse({ type: NoResponseBody })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiConflictResponse()
  @Post('/users')
  @HttpCode(200)
  async postAdminUser(
    @Request() req,
    @Body() createAdminRequest: CreateAdminRequestDto
  ): Promise<NoResponseBody> {
    const requestAdminUser: RequestAdminUser = req.user
    await this.adminsService.createOneAdminUser(requestAdminUser, createAdminRequest)

    return {}
  }

  @ApiOperation({ summary: 'Get admin by id' })
  @ApiOkResponse({ type: Admin })
  @Get('/users/:userId')
  async getAdminById(@Request() req, @Param('userId') userId: string): Promise<Admin> {
    const requestAdminUser: RequestAdminUser = req.user
    const admin = await this.adminsService.getOneAdminById(requestAdminUser, userId)

    return admin
  }

  @ApiOperation({ summary: 'Get admin by id' })
  @ApiOkResponse({ type: NoResponseBody })
  @Delete('/users/:userId')
  async deleteAdminById(@Request() req, @Param('userId') userId: string): Promise<NoResponseBody> {
    const requestAdminUser: RequestAdminUser = req.user
    await this.adminsService.deleteOneAdminById(requestAdminUser, userId)

    return {}
  }
}

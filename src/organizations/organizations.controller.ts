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
  Patch,
  Param,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { VALIDATION_PIPE_OPTIONS } from '../shared/constants/validation-pipe'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'
import { Organization } from './classes/organization.class'
import {
  CreateOrganizationRequestDto,
  UpdateOrganizationRequestDto,
} from './dto/create-organization.dto'
import { OrganizationsService } from './organizations.service'
import { RequestAdminUser } from '../shared/interfaces'

@ApiTags('organization')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseGuards(FirebaseAdminUserValidateGuard)
@UseInterceptors(CreatedResponseInterceptor)
@Controller('admins')
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Get all organizations' })
  @ApiOkResponse({ type: [Organization] })
  @Get('/organizations')
  async getOrganizations(@Request() req): Promise<Organization[]> {
    const requestAdminUser: RequestAdminUser = req.user

    return this.organizationsService.findAllOrganizations(requestAdminUser)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new organziation' })
  @ApiOkResponse({ type: Organization })
  @ApiBadRequestResponse()
  @Post('/organizations')
  @HttpCode(200)
  async postOrganization(
    @Request() req,
    @Body() createOrganizationRequest: CreateOrganizationRequestDto
  ): Promise<Organization> {
    const requestAdminUser: RequestAdminUser = req.user

    return this.organizationsService.createOneOrganization(
      requestAdminUser,
      createOrganizationRequest
    )
  }

  @ApiOperation({ summary: 'Get organization by id' })
  @ApiOkResponse({ type: Organization })
  @Get('/organizations/:organizationId')
  async getOrganizationById(
    @Request() req,
    @Param('organizationId') organizationId: string
  ): Promise<Organization> {
    const requestAdminUser: RequestAdminUser = req.user
    const organization = await this.organizationsService.getOneOrganizationById(
      requestAdminUser,
      organizationId
    )

    return organization
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Update organization' })
  @ApiOkResponse({ type: CreatedResponse })
  @Patch('/organizations/:organizationId')
  async patchMeProfile(
    @Request() req,
    @Param('organizationId') organizationId: string,
    @Body() updateOrganizationRequest: UpdateOrganizationRequestDto
  ): Promise<CreatedResponse> {
    const requestAdminUser: RequestAdminUser = req.user
    updateOrganizationRequest.organizationId = organizationId

    await this.organizationsService.updateOneOrganization(
      requestAdminUser,
      updateOrganizationRequest
    )

    return {}
  }
}

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
  NotFoundException,
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
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'
import { Organization } from './classes/organization.class'
import {
  CreateOrganizationRequestDto,
  UpdateOrganizationRequestDto,
} from './dto/create-organization.dto'
import { OrganizationsService } from './organizations.service'

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
  async getOrganizations(): Promise<Organization[]> {
    return this.organizationsService.findAllOrganizations()
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Create new organziation' })
  @ApiOkResponse({ type: CreatedResponse })
  @ApiBadRequestResponse()
  @Post('/organizations')
  @HttpCode(200)
  async postOrganization(
    @Request() req,
    @Body() createOrganizationRequest: CreateOrganizationRequestDto
  ): Promise<CreatedResponse> {
    createOrganizationRequest.addedByAdminUserId = req.user.uid
    createOrganizationRequest.addedByAdminEmail = req.user.email
    await this.organizationsService.createOneOrganization(createOrganizationRequest)
    return {}
  }

  @ApiOperation({ summary: 'Get organization by id' })
  @ApiOkResponse({ type: Organization })
  @Get('/organizations/:id')
  async getOrganizationById(@Param('id') id: string): Promise<Organization> {
    const organization = await this.organizationsService.findOneOrganizationById(id)
    if (!organization) {
      throw new NotFoundException('Could not find organization with this id')
    }
    return organization
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Update organization' })
  @ApiOkResponse({ type: CreatedResponse })
  @Patch('/organizations/:id')
  async patchMeProfile(
    @Param('id') id: string,
    @Body() updateOrganizationRequest: UpdateOrganizationRequestDto
  ): Promise<CreatedResponse> {
    updateOrganizationRequest.id = id
    await this.organizationsService.updateOneOrganization(updateOrganizationRequest)
    return {}
  }
}

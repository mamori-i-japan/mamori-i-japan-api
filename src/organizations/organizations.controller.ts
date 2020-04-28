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
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { FirebaseAdminUserValidateGuard } from '../auth/guards/firebase-admin-user-validate.guard'
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { CreatedResponseInterceptor } from '../shared/interceptors/created-response.interceptor'
import { CreatedResponse } from '../shared/classes/created-response.class'
import { Organization } from './classes/organization.class'
import { CreateOrganizationRequestDto } from './dto/create-organization.dto'
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
    console.log('WIP')
    return []
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
}

import {
  Controller,
  Get,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Post,
  Body,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { UsersService } from './users.service'
import { TempID } from './interfaces/temp-id.interface'
import { FirebaseNormalUserValidateGuard } from '../auth/guards/firebase-normal-user-validate.guard'
import { VALIDATION_PIPE_OPTIONS } from '../constants/validation-pipe'
import { CreateCloseContactsRequestDto } from './dto/create-user.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Find users' own TempIDs" })
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseNormalUserValidateGuard)
  @Get('/me/temp_ids')
  async getMeTempIDs(@Request() req): Promise<TempID[]> {
    const userId = req.user.uid
    return this.usersService.getTempIDs(userId)
  }

  @UsePipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS))
  @ApiOperation({ summary: 'Receive close contacts payload from user' })
  @ApiBearerAuth()
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(FirebaseNormalUserValidateGuard)
  @Post('/me/close_contacts')
  async postAdminUser(
    @Request() req,
    @Body() createCloseContactsRequestDto: CreateCloseContactsRequestDto
  ) {
    console.log('----')
    console.log('createCloseContactsRequestDto : ', createCloseContactsRequestDto)
    return 'WIP'
  }
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  organizationCode: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedByAdminUserId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedByAdminEmail: string
}

export class CreateOrganizationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  addedByAdminUserId: string
  addedByAdminEmail: string
}

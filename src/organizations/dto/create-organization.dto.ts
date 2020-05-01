import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateOrganizationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({ example: 'This is optional message. Can be later added via PATCH.' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  id: string
  organizationCode: string
  addedByAdminUserId: string
  addedByAdminEmail: string
}

export class UpdateOrganizationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string

  @ApiPropertyOptional({ example: 'This is optional message. Can be later added via PATCH.' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  message: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  id: string
}

import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty } from 'class-validator'

export class DeleteUserOrganizationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  randomID: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  userId: string
  organizationCode: string
}

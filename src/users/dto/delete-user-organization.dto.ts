import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class DeleteUserOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  randomID: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  userId: string
  organizationCode: string
}

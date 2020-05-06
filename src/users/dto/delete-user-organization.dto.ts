import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class RandomIDDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  randomID: string
}

export class DeleteUserOrganizationDto {
  @ApiProperty({ type: RandomIDDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RandomIDDto)
  randomIDs: RandomIDDto[]

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  userId: string
  organizationCode: string
}

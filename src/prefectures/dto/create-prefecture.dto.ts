import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max } from 'class-validator'
import { ResourceWithACL } from '../../shared/acl'

export class CreatePrefectureRequestDto extends ResourceWithACL {
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
  prefectureId: number
  addedByAdminUserId: string
  addedByAdminEmail: string
}

export class UpdatePrefectureRequestDto {
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
  prefectureId: number
}

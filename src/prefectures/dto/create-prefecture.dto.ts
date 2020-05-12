import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator'
import { ResourceWithACL } from '../../shared/acl'

export class CreatePrefectureRequestDto extends ResourceWithACL {
  @ApiPropertyOptional({ example: 'This is optional message. Can be later added via PATCH.' })
  @IsString()
  @IsOptional()
  message: string

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(47)
  prefectureId: number
}

export class UpdatePrefectureRequestDto {
  @ApiPropertyOptional({ example: 'This is optional message. Can be later added via PATCH.' })
  @IsString()
  @IsOptional()
  message: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  prefectureId: number
}

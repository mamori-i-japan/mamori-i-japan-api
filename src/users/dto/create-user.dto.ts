import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string
}

export class CreateUserProfileDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organizationCode: string
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional({ example: 'A12B34' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Transform((value) => value.toUpperCase(), { toClassOnly: true })
  organizationCode: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  userId: string
}

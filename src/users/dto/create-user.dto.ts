import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

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
  organizationCode: string
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateAdminProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prefecture: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender: string
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminUserId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string
}

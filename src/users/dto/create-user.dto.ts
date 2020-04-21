import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateUserProfileDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  job: string
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}

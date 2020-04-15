import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  secretRandomToken: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
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

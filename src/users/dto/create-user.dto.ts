import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator'

export class CreateUserProfileDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  organization: string
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string
}

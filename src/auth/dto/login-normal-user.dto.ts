import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator'

export class LoginNormalUserRequestDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  job: string
}

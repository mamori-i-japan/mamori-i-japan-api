import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty, IsInt, Max, Min } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string
}

export class CreateUserProfileDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(47)
  prefecture: number
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(47)
  prefecture: number

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  userId: string
}

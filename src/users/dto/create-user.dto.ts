import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  userId: string

  @ApiPropertyOptional()
  prefecture: string

  @ApiPropertyOptional()
  age: string

  @ApiPropertyOptional()
  gender: string

  @ApiProperty()
  secretRandomToken: string
}

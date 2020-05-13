import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min, Max } from 'class-validator'

export class LoginNormalUserRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(47)
  prefecture: number
}

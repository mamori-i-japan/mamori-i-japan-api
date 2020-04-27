import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class LoginNormalUserRequestDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number
}

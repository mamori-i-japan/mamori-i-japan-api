import { ApiProperty } from '@nestjs/swagger'
import { IsPhoneNumber, IsNotEmpty } from 'class-validator'

export class SetPositiveFlagDto {
  @ApiProperty()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phoneNumber: string
}

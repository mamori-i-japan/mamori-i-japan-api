import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateAdminProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string
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

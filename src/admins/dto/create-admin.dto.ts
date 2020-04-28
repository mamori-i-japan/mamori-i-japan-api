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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedByAdminUserId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedByAdminEmail: string
}

export class CreateAdminRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  addedByAdminUserId: string
  addedByAdminEmail: string
}

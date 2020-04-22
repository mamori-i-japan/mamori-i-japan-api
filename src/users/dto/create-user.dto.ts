import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsPhoneNumber,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateUserProfileDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  job: string
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phoneNumber: string
}

export class CreateCloseContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  externalTempId: string

  @ApiProperty()
  @IsNumber()
  contactStartTime: number

  @ApiProperty()
  @IsNumber()
  contactEndTime: number
}

export class CreateCloseContactsRequestDto {
  @ApiProperty({ type: CreateCloseContactDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCloseContactDto)
  closeContacts: CreateCloseContactDto[]
}

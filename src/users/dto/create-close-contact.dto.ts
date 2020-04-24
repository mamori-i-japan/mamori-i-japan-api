import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCloseContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uniqueInsertKey: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  externalTempId: string

  @ApiProperty({ example: 1588297800 })
  @IsNumber()
  contactStartTime: number

  @ApiProperty({ example: 1588297800 })
  @IsNumber()
  contactEndTime: number

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  selfUserId: string
}

export class CreateCloseContactsRequestDto {
  @ApiProperty({ type: CreateCloseContactDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCloseContactDto)
  closeContacts: CreateCloseContactDto[]
}

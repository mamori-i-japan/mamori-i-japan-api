import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { Moment } from 'moment-timezone'
import * as moment from 'moment-timezone'

export class TempIDDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tempID: string

  @ApiProperty({ example: 1588297800 })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform((value) => moment.unix(value), { toClassOnly: true })
  validFrom: Moment

  @ApiProperty({ example: 1588297800 })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform((value) => moment.unix(value), { toClassOnly: true })
  validTo: Moment
}

export class SetPositiveFlagDto {
  // TODO : implement a connection to the external interface
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // centerGeneratedCode: string // FIXME : give me a nice name
}

export class CreateDiagnosisKeysForOrgDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  randomID: string

  @ApiProperty({ type: TempIDDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TempIDDto)
  tempIDs: TempIDDto[]

  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  organizationCode: string
}

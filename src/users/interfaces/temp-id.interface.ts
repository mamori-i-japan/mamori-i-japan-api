import { ApiProperty } from '@nestjs/swagger'

export class TempID {
  @ApiProperty()
  tempID: string

  @ApiProperty()
  validFrom: Date

  @ApiProperty()
  validTo: Date
}

import { ApiProperty } from '@nestjs/swagger'

export class TempID {
  @ApiProperty()
  tempID: string

  @ApiProperty({ example: 1588297800 })
  validFrom: number

  @ApiProperty({ example: 1588297800 })
  validTo: number
}

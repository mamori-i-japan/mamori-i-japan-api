import { ApiProperty } from '@nestjs/swagger'

export class ResourceWithACL {
  @ApiProperty({
    example: ['SUPER_ADMIN_KEY', 'NATIONAL_ADMIN_KEY', 'PREFECTURE_ADMIN_KEY|1'],
  })
  accessControlList: string[]
}

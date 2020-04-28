import { CreateAdminDto, CreateAdminRequestDto } from './create-admin.dto'

describe('CreateAdminDto', () => {
  it('should be defined', () => {
    expect(new CreateAdminDto()).toBeDefined()
  })
})

describe('CreateAdminRequestDto', () => {
  it('should be defined', () => {
    expect(new CreateAdminRequestDto()).toBeDefined()
  })
})

import { CreateUserDto, CreateUserProfileDto } from './create-user.dto'

describe('CreateUserProfileDto', () => {
  it('should be defined', () => {
    expect(new CreateUserProfileDto()).toBeDefined()
  })
})

describe('CreateUserDto', () => {
  it('should be defined', () => {
    expect(new CreateUserDto()).toBeDefined()
  })
})

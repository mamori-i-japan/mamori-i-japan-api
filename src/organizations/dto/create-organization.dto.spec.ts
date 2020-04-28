import { CreateOrganizationDto, CreateOrganizationRequestDto } from './create-organization.dto'

describe('CreateOrganizationDto', () => {
  it('should be defined', () => {
    expect(new CreateOrganizationDto()).toBeDefined()
  })
})

describe('CreateOrganizationRequestDto', () => {
  it('should be defined', () => {
    expect(new CreateOrganizationRequestDto()).toBeDefined()
  })
})

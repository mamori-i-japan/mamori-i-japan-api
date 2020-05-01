import {
  CreateOrganizationRequestDto,
  UpdateOrganizationRequestDto,
} from './create-organization.dto'

describe('CreateOrganizationRequestDto', () => {
  it('should be defined', () => {
    expect(new CreateOrganizationRequestDto()).toBeDefined()
  })
})

describe('UpdateOrganizationRequestDto', () => {
  it('should be defined', () => {
    expect(new UpdateOrganizationRequestDto()).toBeDefined()
  })
})

import { CreateCloseContactDto, CreateCloseContactsRequestDto } from './create-close-contact.dto'

describe('CreateCloseContactDto', () => {
  it('should be defined', () => {
    expect(new CreateCloseContactDto()).toBeDefined()
  })
})

describe('CreateCloseContactsRequestDto', () => {
  it('should be defined', () => {
    expect(new CreateCloseContactsRequestDto()).toBeDefined()
  })
})

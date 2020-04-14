import { CreateCatDto } from './create-cat.dto'

describe('CreateCatDto', () => {
  it('should be defined', () => {
    expect(new CreateCatDto()).toBeDefined()
  })
})

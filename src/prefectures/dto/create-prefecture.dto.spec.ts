import { CreatePrefectureRequestDto, UpdatePrefectureRequestDto } from './create-prefecture.dto'

describe('CreatePrefectureRequestDto', () => {
  it('should be defined', () => {
    expect(new CreatePrefectureRequestDto()).toBeDefined()
  })
})

describe('UpdatePrefectureRequestDto', () => {
  it('should be defined', () => {
    expect(new UpdatePrefectureRequestDto()).toBeDefined()
  })
})

import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'
import { CatsRepository } from './cats.repository'

@Injectable()
export class CatsService {
  constructor(private catsRepository: CatsRepository) {}
  create(cat: Cat) {
    return this.catsRepository.createOne(cat)
  }

  async findOne(name: string): Promise<Cat | undefined> {
    return this.catsRepository.findOne(name)
  }
}

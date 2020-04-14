import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'

@Injectable()
export class CatsRepository {
  private readonly cats: Cat[] = []
  constructor() {
    this.cats = [
      {
        age: 1,
        name: 'john',
        breeds: ['changeme'],
      },
      {
        age: 2,
        name: 'chris',
        breeds: ['secret'],
      },
    ]
  }
  createOne(cat: Cat) {
    this.cats.push(cat)
  }

  async findOne(name: string): Promise<Cat | undefined> {
    return this.cats.find((cat) => cat.name === name)
  }
}

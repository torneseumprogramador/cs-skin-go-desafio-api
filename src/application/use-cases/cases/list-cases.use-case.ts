import { Injectable, Inject } from '@nestjs/common';
import { ICaseRepository } from '../../../domain/repositories/case.repository.interface';

@Injectable()
export class ListCasesUseCase {
  constructor(
    @Inject('ICaseRepository')
    private readonly caseRepository: ICaseRepository,
  ) {}

  async execute() {
    const cases = await this.caseRepository.findAll();

    return {
      cases: cases.map((c) => ({
        id: c.id,
        name: c.name,
        price: parseFloat(c.price.toString()),
        image: c.image,
        description: c.description,
        rarity: c.rarity,
        isFree: c.isFree,
      })),
    };
  }
}



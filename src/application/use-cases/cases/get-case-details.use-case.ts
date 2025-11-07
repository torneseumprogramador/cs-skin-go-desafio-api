import { Injectable, NotFoundException } from '@nestjs/common';
import { ICaseRepository } from '../../../domain/repositories/case.repository.interface';

@Injectable()
export class GetCaseDetailsUseCase {
  constructor(private readonly caseRepository: ICaseRepository) {}

  async execute(id: string) {
    const caseEntity = await this.caseRepository.findByIdWithSkins(id);

    if (!caseEntity) {
      throw new NotFoundException('Case não encontrado');
    }

    const skins = await this.caseRepository.findSkinsByCaseId(id);

    return {
      case: {
        id: caseEntity.id,
        name: caseEntity.name,
        price: parseFloat(caseEntity.price.toString()),
        image: caseEntity.image,
        description: caseEntity.description,
        rarity: caseEntity.rarity,
        isFree: caseEntity.isFree,
        skins: skins.map((skin) => ({
          id: skin.id,
          name: skin.name,
          weapon: skin.weapon,
          rarity: skin.rarity,
          chance: parseFloat(skin.chance.toString()),
          image: skin.image,
        })),
      },
    };
  }
}



import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from '../../domain/entities/case.entity';
import { Skin } from '../../domain/entities/skin.entity';
import { ICaseRepository } from '../../domain/repositories/case.repository.interface';

@Injectable()
export class CaseRepository implements ICaseRepository {
  constructor(
    @InjectRepository(Case)
    private readonly caseRepo: Repository<Case>,
    @InjectRepository(Skin)
    private readonly skinRepo: Repository<Skin>,
  ) {}

  async findAll(): Promise<Case[]> {
    return this.caseRepo.find({ order: { price: 'ASC' } });
  }

  async findById(id: string): Promise<Case | null> {
    return this.caseRepo.findOne({ where: { id } });
  }

  async findByIdWithSkins(id: string): Promise<Case | null> {
    const caseEntity = await this.caseRepo.findOne({ where: { id } });
    if (!caseEntity) return null;

    const skins = await this.skinRepo.find({ where: { caseId: id } });
    return { ...caseEntity, skins } as any;
  }

  async findSkinsByCaseId(caseId: string): Promise<Skin[]> {
    return this.skinRepo.find({ where: { caseId } });
  }
}



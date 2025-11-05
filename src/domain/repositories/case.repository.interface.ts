import { Case } from '../entities/case.entity';
import { Skin } from '../entities/skin.entity';

export interface ICaseRepository {
  findAll(): Promise<Case[]>;
  findById(id: string): Promise<Case | null>;
  findByIdWithSkins(id: string): Promise<Case | null>;
  findSkinsByCaseId(caseId: string): Promise<Skin[]>;
}


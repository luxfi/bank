import { EntityRepository } from '@mikro-orm/postgresql';
import { RiskAssessment } from '../entities';

export class RiskAssessmentRepository extends EntityRepository<RiskAssessment> {}

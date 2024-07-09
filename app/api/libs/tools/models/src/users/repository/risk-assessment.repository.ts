import { EntityRepository } from '@mikro-orm/mysql';
import { RiskAssessment } from '../entities';

export class RiskAssessmentRepository extends EntityRepository<RiskAssessment> {}

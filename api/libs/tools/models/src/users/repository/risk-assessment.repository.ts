import { EntityRepository } from '@mikro-orm/knex';
import { RiskAssessment } from '../entities';

export class RiskAssessmentRepository extends EntityRepository<RiskAssessment> {}

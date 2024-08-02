import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Beneficiary } from './entities';

export const BENEFICIARIES_REGISTERED_ENTITIES = [Beneficiary];

export const MikroOrmRegisteredForBeneficiaries = () =>
  MikroOrmModule.forFeature(BENEFICIARIES_REGISTERED_ENTITIES);

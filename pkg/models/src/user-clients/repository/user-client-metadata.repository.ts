import { EntityRepository } from '@mikro-orm/knex';
import { UserClientMetadata } from '../entities';

export class UserClientMetadataRepository extends EntityRepository<UserClientMetadata> {}

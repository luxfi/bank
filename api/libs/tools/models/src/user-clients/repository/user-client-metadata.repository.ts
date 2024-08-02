import { EntityRepository } from '@mikro-orm/postgresql';
import { UserClientMetadata } from '../entities';

export class UserClientMetadataRepository extends EntityRepository<UserClientMetadata> {}

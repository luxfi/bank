import { EntityRepository } from '@mikro-orm/mysql';
import { UserClientMetadata } from '../entities';

export class UserClientMetadataRepository extends EntityRepository<UserClientMetadata> {}

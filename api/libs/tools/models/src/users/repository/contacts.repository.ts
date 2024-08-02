import { EntityRepository } from '@mikro-orm/postgresql';
import { Contact } from '../entities';

export class ContactsRepository extends EntityRepository<Contact> {}

import { EntityRepository } from '@mikro-orm/knex';
import { Contact } from '../entities';

export class ContactsRepository extends EntityRepository<Contact> {}

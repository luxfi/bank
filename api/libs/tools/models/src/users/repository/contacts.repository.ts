import { EntityRepository } from '@mikro-orm/mysql';
import { Contact } from '../entities';

export class ContactsRepository extends EntityRepository<Contact> {}

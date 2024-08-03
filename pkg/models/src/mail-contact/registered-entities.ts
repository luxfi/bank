import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NewsLetter } from './entities';

export const MAIL_CONTACT_REGISTERED_ENTITIES = [NewsLetter];

export const MikroOrmRegisteredForMailContact = () =>
  MikroOrmModule.forFeature(MAIL_CONTACT_REGISTERED_ENTITIES);

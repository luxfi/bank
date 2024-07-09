import { MikroOrmModule } from '@mikro-orm/nestjs';
import {
  Account,
  Contact,
  Invitation,
  RequestAccess,
  User,
  UserDocument,
} from './entities';

export const USER_REGISTERED_ENTITIES = [
  User,
  Contact,
  Account,
  UserDocument,
  Invitation,
  RequestAccess,
];

export const MikroOrmRegisteredForUser = () =>
  MikroOrmModule.forFeature(USER_REGISTERED_ENTITIES);

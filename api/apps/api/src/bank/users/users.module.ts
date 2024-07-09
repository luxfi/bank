import { Module } from '@nestjs/common';

import {
  GetLoggedUserUseCase,
  GetUserDomainUseCase,
  GetUsersBySelectDomainUseCase,
  GetUsersDomainUseCase,
  UpdateUserDomainUseCase,
} from '@domain/use-cases';
import {
  MikroOrmRegisteredForUser,
  MikroOrmRegisteredForUserClients,
} from '@tools/models';
import { UsersController } from './users.controller';

@Module({
  imports: [MikroOrmRegisteredForUser(), MikroOrmRegisteredForUserClients()],
  controllers: [UsersController],
  providers: [
    GetLoggedUserUseCase,
    GetUsersDomainUseCase,
    GetUsersBySelectDomainUseCase,
    GetUserDomainUseCase,
    UpdateUserDomainUseCase,
  ],
})
export class UsersV2Module {}

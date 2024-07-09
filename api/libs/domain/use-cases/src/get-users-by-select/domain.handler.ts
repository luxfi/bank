import {
  User,
  UserClientsRepository,
  UserRole,
  UsersRepository,
} from '@tools/models';

import { Injectable } from '@nestjs/common';
import { GetUsersRequest } from './types/get-users.request.type';
import { ListUsersSelectResponse } from './types/get-users.response.type';

@Injectable()
export class GetUsersBySelectDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userClientRepository: UserClientsRepository,
  ) {}

  async handle(
    query: GetUsersRequest,
    user: User,
  ): Promise<ListUsersSelectResponse> {
    if (!user.role.includes(UserRole.SuperAdmin)) {
      const client = user.getCurrentClient();
      return this.usersRepository.findALlBySelect(
        query.name ?? '',
        client?.account?.uuid ?? '',
      );
    }

    return this.usersRepository.findALlBySelect(query.name ?? '');
  }
}

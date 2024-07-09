import {
  User,
  UserClientsRepository,
  UserRole,
  UsersRepository,
} from '@tools/models';

import { Injectable } from '@nestjs/common';
import { GetUsersRequest } from './types/get-users.request.type';
import { ListUsersResponse } from './types/get-users.response.type';

@Injectable()
export class GetUsersDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userClientRepository: UserClientsRepository,
  ) {}

  async handle(query: GetUsersRequest, user: User): Promise<ListUsersResponse> {
    if (!user.role.includes(UserRole.SuperAdmin)) {
      const client = user.getCurrentClient();
      return this.usersRepository.findAllPaginated(
        query,
        client?.account?.uuid ?? '',
        client?.uuid ?? '',
      );
    }

    return this.userClientRepository.findAllPaginated(query);
  }
}

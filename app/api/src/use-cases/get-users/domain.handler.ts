import { User, UserClientsRepository, UserRole, UsersRepository, GetUsersRequest, ListUsersResponse } from '@cdaxfx/tools-models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUsersDomainUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly userClientRepository: UserClientsRepository
    ) { }

    async handle(query: GetUsersRequest, user: User): Promise<ListUsersResponse> {
        if (!user.role.includes(UserRole.SuperAdmin)) {
            const client = user.getCurrentClient();
            return this.usersRepository.findAllPaginated(
                query,
                client?.account?.uuid ?? '',
                client?.uuid ?? ''
            );
        }

        return this.userClientRepository.findAllPaginated(query);
    }
}

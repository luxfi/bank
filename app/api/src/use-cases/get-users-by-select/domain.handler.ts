import { User, UserClientsRepository, UserRole, UsersRepository, GetUsersBySelectRequest, ListUsersSelectResponse } from '@luxbank/tools-models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUsersBySelectDomainUseCase {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly userClientRepository: UserClientsRepository
    ) { }

    async handle(query: GetUsersBySelectRequest, user: User): Promise<ListUsersSelectResponse> {
        if (!user.role.includes(UserRole.SuperAdmin)) {
            const client = user.getCurrentClient();
            return this.usersRepository.findALlBySelect(
                query.name ?? '',
                client?.account?.uuid ?? ''
            );
        }

        return this.usersRepository.findALlBySelect(query.name ?? '');
    }
}

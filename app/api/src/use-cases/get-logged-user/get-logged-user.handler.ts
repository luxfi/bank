import { Injectable } from '@nestjs/common';
import { Client, UsersRepository } from '@luxbank/tools-models';
import { PayloadInterface } from '../../auth/payload.interface';
import { UseCaseHandler } from '../types/use-case-handler.interface';

@Injectable()
export class GetLoggedUserUseCase extends UseCaseHandler {
    constructor(private usersRepository: UsersRepository) {
        super();
    }

    async handle(payload: PayloadInterface) {
        const user = await this.usersRepository.findByUsername(payload.username);

        if (!user)
            return null;

        const client = user.clients
            .getItems()
            .find((c) => c.uuid === payload.clientUUID) as Client;

        if (client) {
            user.setCurrentClient(client.uuid);
            user.getCurrentClient();
        }

        if (payload.personatedBy)
            user.setPersonated(payload.personatedBy);

        const role = user.userClients
            .getItems()
            .find((uc) => uc.client.uuid === payload.clientUUID)?.metadata.role;
        user.setRole(role);

        return user;
    }
}

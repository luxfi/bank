import { User, UserRole, UsersRepository } from '@cdaxfx/tools-models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetUserRequest } from './types/get-user.request.type';
import { UserResponse } from './types/get-user.response.type';

@Injectable()
export class GetUserDomainUseCase {
    constructor(private readonly usersRepository: UsersRepository) { }

    async handle(query: GetUserRequest, user: User): Promise<UserResponse> {
        const { id, clientId } = query;
        const clientUUID = clientId || user.getCurrentClient()?.uuid;
        const _user = await this.usersRepository.findUserWithMeta(id);

        if (!_user)
            throw new BadRequestException({messages: ['User not found.']});

        if (user.role !== UserRole.SuperAdmin && !_user.clients.getItems().find((c) => c.uuid === clientUUID))
            throw new BadRequestException({messages: ['User is not registered in this client.']});

        return {
            id: _user.uuid,
            email: _user.username,
            role: !!clientUUID
                ? _user.getMetadataByClient(clientUUID)?.role ?? ''
                : '',
            firstname: _user.firstname,
            lastname: _user.lastname,
            phone: _user.contact?.mobileNumber ?? '',
            status: !!_user.archivedAt
                ? 'archived'
                : !!_user.verifiedAt
                    ? 'approved'
                    : 'pending',
            country: _user.contact?.country ?? ''
        };
    }
}

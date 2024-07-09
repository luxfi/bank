import {
  Contact,
  User,
  UserClient,
  UserClientMetadata,
  UserClientsRepository,
  UserRole,
  UsersRepository,
} from '@tools/models';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserRequest } from './types/update-user.request.type';
import { UserUpdateResponse } from './types/update-user.response.type';

@Injectable()
export class UpdateUserDomainUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userClientsRepository: UserClientsRepository,
  ) {}

  async handle(
    query: UpdateUserRequest,
    user: User,
  ): Promise<UserUpdateResponse> {
    const { id } = query;
    const clientUUID = user.getCurrentClient()?.uuid;
    const _user = await this.usersRepository.findUserWithMeta(id);

    if (!_user) {
      throw new BadRequestException({
        messages: ['User not found.'],
      });
    }

    if (user.role !== UserRole.SuperAdmin && !clientUUID) {
      throw new BadRequestException({
        messages: ['No client associated with the current user.'],
      });
    }

    if (
      user.role !== UserRole.SuperAdmin &&
      !_user.clients.getItems().find((c) => c.uuid === clientUUID)
    ) {
      throw new BadRequestException({
        messages: ['User is not registered in this client.'],
      });
    }

    if (_user.role !== UserRole.SuperAdmin && !!query.password) {
      throw new BadRequestException({
        messages: ['Only SuperAdmin can update password.'],
      });
    }

    await this.updateUsers(query, clientUUID);

    return {
      id: _user.uuid,
    };
  }

  async updateUsers(data: UpdateUserRequest, uuid?: string) {
    const user = await this.usersRepository.findByUuid(data.id);

    if (!user) {
      throw new NotFoundException({
        messages: ['User not found.'],
      });
    }

    if (!user.contact) {
      const contact = new Contact();
      user.contact = contact as any;
    }

    if (data.firstname) {
      user.firstname = data.firstname;
    }

    if (data.lastname) {
      user.lastname = data.lastname;
    }

    if (user.contact && !!data.phone) {
      user.contact.mobileNumber = data.phone ?? user.contact?.mobileNumber;
    }

    if (user.contact && !!data.country) {
      user.contact.country = data.country;
    }

    if (!!uuid && !!data.role) {
      await this.updateRoleMetadata(user.uuid, uuid, data.role as UserRole);
    }

    if (data.password && data.password.length > 0) {
      await user.setPassword(data.password);
    }

    await this.usersRepository.store(user);
  }

  async updateRoleMetadata(
    userUUID: string,
    clientUUID: string,
    role: UserRole,
  ): Promise<UserClient> {
    const userClient = await this.userClientsRepository.findByUserAndClientUuid(
      userUUID,
      clientUUID,
    );
    if (!userClient) {
      throw new NotFoundException({
        messages: ['UserClient not found.'],
      });
    }
    const metadata = userClient.metadata || new UserClientMetadata();
    this.userClientsRepository.assign(userClient, {
      metadata: { ...metadata, role },
    });
    await this.userClientsRepository.flush();
    return userClient;
  }
}

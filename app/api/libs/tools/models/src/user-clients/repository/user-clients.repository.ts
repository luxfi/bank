import { EntityRepository } from '@mikro-orm/mysql';
import { UserClient } from '../entities';
import { GetUsersRequest } from '@domain/use-cases/get-users/types/get-users.request.type';
import { FilterQuery, QueryFlag } from '@mikro-orm/core';
import { ListUsersResponse } from '@domain/use-cases/get-users/types/get-users.response.type';

export class UserClientsRepository extends EntityRepository<UserClient> {
  async findByUserUuid(userUuid: string): Promise<UserClient | null> {
    return this.findOne({ user: userUuid });
  }

  async findByClientUuid(clientUuid: string): Promise<UserClient | null> {
    return this.findOne({ client: clientUuid });
  }

  async findByUserAndClientUuid(
    userUuid: string,
    clientUuid: string,
  ): Promise<UserClient | null> {
    return this.findOne(
      { user: userUuid, client: clientUuid },
      {
        fields: ['metadata'],
      },
    );
  }

  private sortData(users, orderBy = 'name', order = 'asc') {
    const data = Array.from(users)
      .map((userclient: UserClient) => {
        console.log(userclient);
        const user = userclient?.user;
        const client =
          userclient?.client?.account?.businessMetadata ??
          userclient?.client?.account?.individualMetadata;
        const metaData = userclient?.metadata;

        return {
          id: user?.uuid,
          name: `${user?.firstname} ${user?.lastname}`,
          client: client?.getName() ?? '',
          status: !!user?.archivedAt
            ? 'archived'
            : !!user?.verifiedAt
            ? 'approved'
            : 'pending',
          role: metaData?.role,
          email: user?.username,
        };
      })
      .sort((a, b) => {
        const fieldA = a[orderBy];
        const fieldB = b[orderBy];

        if (fieldA < fieldB) {
          return order === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return order === 'asc' ? 1 : -1;
        }
        return 0; // equals
      });

    return data;
  }

  async findAllPaginated(query: GetUsersRequest): Promise<ListUsersResponse> {
    const {
      name,
      userId,
      status,
      role,
      order = 'asc',
      orderBy = 'name',
      page = 1,
      limit = 10,
      client,
    } = query;

    let where: FilterQuery<UserClient> = {
      user: {
        archivedAt: null,
        deletedAt: null,
      },
    };

    if (userId) {
      where['user_uuid'] = userId;
    }

    if (name) {
      const [firstname, lastname] = name.split(' ');
      where = {
        user: {
          $or: [
            { firstname: { $like: `%${firstname ?? name}%` } },
            { lastname: { $like: `%${lastname ?? name}%` } },
          ],
        },
      };
    }

    if (client) {
      where['client_uuid'] = client;
    }

    if (status) {
      const mapstatus = {
        pending: { user: { verifiedAt: null } },
        approved: { user: { verifiedAt: { $ne: null } } },
        archived: {
          user: { $and: [{ archivedAt: { $ne: null } }, { deletedAt: null }] },
        },
      };
      where = { ...where, ...mapstatus[status] } as FilterQuery<UserClient>;
    }

    if (role) {
      where['metadata'] = { role: role };
    }

    const [users, totalEntries] = await this.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      populate: [
        'user',
        'metadata',
        'user.contact',
        'client',
        'client.account',
        'client.account.businessMetadata',
        'client.account.individualMetadata',
      ],
    });

    const data = this.sortData(users, orderBy, order);

    const totalPages = Math.ceil(totalEntries / limit);
    const pagination = {
      totalEntries,
      totalPages,
      page,
      limit,
    };

    return { data, pagination };
  }
}

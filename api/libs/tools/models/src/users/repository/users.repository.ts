import { EntityRepository } from '@mikro-orm/knex';
import { UserRole, UserRoles, ManagerRoles } from '../enums';
import { User } from '../entities';
import { Client } from '../../clients';
import { FilterQuery } from '@mikro-orm/core';
import { ListUsersResponse, ListUsersSelectResponse } from '../types';

interface GetUsersRequest {
  name?: string;
  userId?: string;
  status?: 'pending' | 'approved' | 'archived';
  role?: UserRole;
  order?: 'asc' | 'desc';
  orderBy?: 'username' | 'role' | 'status';
  page?: number;
  limit?: number;
}

export class UsersRepository extends EntityRepository<User> {
  async getManagerUsersByAccountId(accountId: string): Promise<User[]> {
    return this.find({
      userClients: {
        client: { account: { cloudCurrencyId: accountId } },
        metadata: { role: { $in: ManagerRoles } }
      },
      deletedAt: null
    });
  }

  async updatePasswordUpdatedAt(username: string) {
    return this.nativeUpdate({ username }, { passwordUpdatedAt: new Date() });
  }

  async findUsersWithOldPasswords(): Promise<User[]> {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

    return this.find({
      $or: [
        { passwordUpdatedAt: { $lt: sixMonthsAgo } },
        { passwordUpdatedAt: null }
      ],
      deletedAt: null
    });
  }

  async findByUsernameToLogin(username: string): Promise<User | null> {
    return this.findOne({ username }, { populate: ['clients'] });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOne(
      { username },
      {
        convertCustomTypes: true,
        populate: [
          'clients',
          'contact',
          'userClients.metadata',
          'contact.account',
          'clients.account',
          'clients.account.businessMetadata',
          'clients.account.individualMetadata',
          'clients.account.bankMetadata',
        ]
      }
    ).then((user) => {
      if (!!user?.clients) {
        user.clients.getItems().forEach((client: Client) => {
          client.setName();
        });
      }
      return user;
    });
  }

  async findByOpenPaydId(openPaydId: string): Promise<User | null> {
    return this.findOne(
      {
        contact: { account: { openPaydId, deletedAt: null }, deletedAt: null },
        deletedAt: null,
      },
      { populate: ['contact', 'contact.account'] }
    );
  }
  async findByCurrencyCloudId(cloudCurrencyId: string): Promise<User | null> {
    return this.findOne(
      {
        contact: {
          account: { cloudCurrencyId, deletedAt: null },
          deletedAt: null,
        },
        deletedAt: null,
      },
      { populate: ['contact', 'contact.account'] }
    );
  }

  async findByOpenPaydIds(openPaydIds: string[]): Promise<User[] | null> {
    return this.find(
      {
        contact: {
          account: { openPaydId: { $in: openPaydIds }, deletedAt: null },
          deletedAt: null,
        },
        deletedAt: null,
      },
      { populate: ['contact', 'contact.account'] }
    );
  }

  async findByCurrencyCloudIds(cloudCurrencyIds: string[]): Promise<User[] | null> {
    return this.find(
      {
        contact: {
          account: {
            cloudCurrencyId: { $in: cloudCurrencyIds },
            deletedAt: null,
          },
          deletedAt: null
        },
        deletedAt: null
      },
      { populate: ['contact', 'contact.account'] }
    );
  }

  async findByUuid(uuid: string) {
    return this.findOne(
      { uuid, deletedAt: null, archivedAt: null },
      {
        populate: [
          'clients',
          'contact',
          'clients.account',
          'clients.users',
          'clients.userClients',
          'clients.users.userClients.metadata',
          'clients.users.contact',
          'clients.account.bankMetadata',
          'clients.account.individualMetadata',
          'clients.account.businessMetadata',
          'clients.account.bankMetadata',
          'clients.account.pendingMetadatas',
          'clients.account.riskAssessments',
          'clients.account.brokers',
          'clients.account.directors',
          'clients.account.shareholders',
          'clients.account.shareholders.businessMetadata',
          'clients.account.shareholders.individualMetadata',
          'clients.account.fee',
          'documents',
          'documents.document'
        ]
      }
    );
  }

  async findUserByUuid(uuid: string) {
    return this.findOne({ uuid, deletedAt: null }, { populate: ['clients'] });
  }

  async findUserWithMeta(uuid: string) {
    return this.findOne(
      { uuid, deletedAt: null },
      {
        populate: [
          'contact',
          'clients',
          'userClients',
          'userClients.metadata',
          'clients.account',
          'clients.account.bankMetadata',
          'clients.account.individualMetadata',
          'clients.account.businessMetadata'
        ]
      }
    );
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    return this.findOne({
      contact: { mobileNumber, deletedAt: null },
      deletedAt: null
    });
  }

  async findAndCountByRoles(roles: UserRole[], page: number, limit: number, uuid?: string | undefined) {
    const search = uuid
      ? {
          userClients: {metadata: { role: { $in: roles } }},
          clients: {account: {uuid}},
          archivedAt: null
        }
      : {
          userClients: {metadata: { role: { $in: roles } }},
          archivedAt: null
        };
    return this.findAndCount(search, {
      limit,
      offset: (page - 1) * limit,
      populate: [
        'contact',
        'userClients.metadata',
        'contact.account',
        'contact.account.businessMetadata',
        'contact.account.individualMetadata',
        'contact.account.riskAssessments'
      ],
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findAndCountNonSubAccount({ name, entityType, country, page, limit }) {
    const search = <any>{
      $and: [
        { userClients: { metadata: { role: { $in: UserRoles } } } },
        { contact: { isSubAccount: false, deletedAt: null } },
        { deletedAt: null },
        { archivedAt: null }
      ]
    };

    if (country) {
      search.$and.push({
        $or: [
          {
            contact: {
              country: country
            }
          },
          {
            contact: {
              account: {
                businessMetadata: {
                  countryOfRegistration: country
                }
              }
            }
          },
          {
            contact: {
              account: {
                individualMetadata: {
                  country: country
                }
              }
            }
          }
        ]
      });
    }

    if (name) {
      search.$and.push({
        $or: [
          {
            firstname: {
              $like: `%${name}%`
            }
          },
          {
            username: {
              $like: `%${name}%`
            }
          },
          {
            lastname: {
              $like: `%${name}%`
            }
          },
          {
            contact: {
              account: {
                businessMetadata: {
                  companyName: {
                    $like: `%${name}%`
                  }
                }
              }
            }
          }
        ]
      });
    }

    if (entityType)
      search.$and.push({clients: {account: {entityType}}});
  
    return this.findAndCount(search, {
      limit,
      offset: (page - 1) * limit,
      populate: [
        'contact',
        'clients',
        'userClients.metadata',
        'clients.account',
        'clients.account.businessMetadata',
        'clients.account.individualMetadata',
        'clients.account.riskAssessments'
      ],
      orderBy: {
        createdAt: 'desc',
        clients: {
          account: {
            riskAssessments: { createdAt: 'desc' }
          }
        }
      }
    });
  }

  async findAndCountSubAccount(page: number, limit: number) {
    return this.findAndCount(
      {
        role: { $in: UserRoles },
        contact: { isSubAccount: true, deletedAt: null },
        deletedAt: null,
        archivedAt: null
      },
      {
        limit,
        offset: (page - 1) * limit,
        orderBy: {
          createdAt: 'desc'
        }
      }
    );
  }

  async store(user: User) {
    return this.getEntityManager().persistAndFlush(user);
  }

  async findALlBySelect(name: string, accountUUID?: string): Promise<ListUsersSelectResponse> {
    const [users, totalEntries] = await this.findAndCount(
      {
        ...(accountUUID
          ? {
              clients: {
                account: {
                  uuid: accountUUID
                }
              }
            }
          : {}),
        $or: [
          { firstname: { $like: `%${name}%` } },
          { lastname: { $like: `%${name}%` } },
          { username: { $like: `%${name}%` } }
        ],
        archivedAt: null,
        deletedAt: null,
      },
      {
        limit: 10,
        orderBy: {
          firstname: 'asc'
        }
      }
    );

    const data = Array.from(users).map((user: User) => ({
      id: user.uuid,
      name: `${user.firstname} ${user.lastname}`,
      email: user.username
    }));
    const totalPages = Math.ceil(totalEntries / 10);
    const pagination = {
      totalEntries,
      totalPages,
      page: 1,
      limit: 10
    };
    return { data, pagination };
  }

  async findAllPaginated(query: GetUsersRequest, accountUUID: string, clientUUID: string): Promise<ListUsersResponse> {
    const {name, status, userId, role, order = 'asc', orderBy = 'username', page = 1, limit = 10} = query;

    let where: FilterQuery<User> = accountUUID
      ? {
          clients: {
            account: {
              uuid: accountUUID,
            }
          },
          archivedAt: null,
          deletedAt: null
        }
      : {
          archivedAt: null,
          deletedAt: null
        };

    if (userId)
      where = { ...where, uuid: userId };

    if (name) {
      where = {
        $or: [
          { firstname: { $like: `%${name}%` } },
          { lastname: { $like: `%${name}%` } },
          {
            clients: {
              account: {
                businessMetadata: { companyName: { $like: `%${name}%` } }
              }
            }
          },
          {
            clients: {
              account: {
                individualMetadata: { firstname: { $like: `%${name}%` } }
              }
            }
          },
          {
            clients: {
              account: {
                individualMetadata: { lastname: { $like: `%${name}%` } }
              }
            }
          }
        ]
      };
    }

    if (status) {
      const mapstatus = {
        pending: { verifiedAt: null },
        approved: { verifiedAt: { $ne: null } },
        archived: { archivedAt: { $ne: null } }
      };
      where = { ...where, ...mapstatus[status] } as FilterQuery<User>;
    }

    if (role) {
      where['userClients'] = {
        client_uuid: clientUUID,
        metadata: { role: role }
      };
    }

    const [users, totalEntries] = await this.findAndCount(where, {
      limit,
      offset: (page - 1) * limit,
      populate: ['userClients', 'userClients.metadata', 'contact'],
      orderBy: {
        [orderBy]: order
      }
    });

    const data = Array.from(users).map((user) => {
      const metaData = user.getMetadataByClient(clientUUID);
      return {
        id: user.uuid,
        name: `${user.firstname} ${user.lastname}`,
        status: !!user.archivedAt
          ? 'archived'
          : !!user.verifiedAt
          ? 'approved'
          : 'pending',
        role: metaData?.role ?? '',
        email: user.username
      };
    });

    const totalPages = Math.ceil(totalEntries / limit);
    const pagination = {
      totalEntries,
      totalPages,
      page,
      limit
    };

    return { data, pagination };
  }

  async findUsers(roles: UserRole[], page: number, limit: number, uuid: string, status?: string) {
    const filters: FilterQuery<User> = {
      userClients: {
        metadata: { role: { $in: roles } }
      },
      clients: {
        account: {
          uuid
        }
      },
      archivedAt: null,
      deletedAt: null,
    };

    if (status)
      filters.verifiedAt = status === 'verified' ? { $ne: null } : null;

    return this.findAndCount(filters, {
      limit,
      offset: (page - 1) * limit,
      populate: ['userClients', 'userClients.metadata', 'contact'],
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findUsersByClient(
    clientUUID: string,
    query: {
      page: number;
      limit: number;
      status?: string;
      roles?: UserRole[];
      archived?: string;
      name?: string;
    }
  ) {
    const filters: FilterQuery<User> = {
      clients: {
        uuid: clientUUID
      },
      deletedAt: null
    };

    if (query.status)
      filters.verifiedAt = query.status === 'verified' ? { $ne: null } : null;

    if (query.roles) {
      filters.userClients = {
        metadata: { role: { $in: query.roles } }
      };
    }

    if (query.archived === 'archived')
      filters.archivedAt = query.archived ? { $ne: null } : null;

    if (query.name) {
      filters.$or = [
        { firstname: { $like: `%${query.name}%` } },
        { lastname: { $like: `%${query.name}%` } }
      ];
    }

    return this.findAndCount(filters, {
      limit: query.limit,
      offset: (query.page - 1) * query.limit,
      populate: ['userClients', 'userClients.metadata', 'contact'],
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

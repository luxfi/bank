import { EntityRepository } from '@mikro-orm/knex';
import { RiskAssessment, UserRoles } from '../../users';
import { Client } from '../entities';

interface ClientSelectResponse {
  id: string;
  name: string;
}

interface GetRiskClientsRequest {
  type?: string;
  page?: number;
  country?: string;
  riskRating?: string;
  pep?: boolean;
  limit?: number;
}

interface ClientRiskResponse {
  clientId?: string;
  userId?: string;
  id?: string;
  name: string;
  type: string;
  riskRating: string;
  lastRA: string;
  nextRA: string;
  PEP: boolean;
  country: string;
  canImpersonate?: boolean;
}

interface ClientSelectRiskPaginatedResponse {
  data: ClientRiskResponse[];
  pagination?: {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
  };
}

export interface ClientSelectPaginatedResponse {
  data: ClientSelectResponse[];
  pagination?: {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
  };
}
export class ClientsRepository extends EntityRepository<Client> {
  async findALlBySelect(name: string): Promise<ClientSelectPaginatedResponse> {
    const query = {
      account: {
        $or: [
          {
            individualMetadata: {
              $or: [
                { firstname: { $like: `%${name}%` } },
                { lastname: { $like: `%${name}%` } }
              ]
            }
          },
          {
            businessMetadata: {
              $or: [{ companyName: { $like: `%${name}%` } }]
            }
          }
        ]
      },
      deletedAt: null,
    };

    const [clients, count] = await this.findAndCount(query, {
      limit: 10,
      orderBy: { createdAt: 'desc' },
      populate: [
        'account',
        'account.businessMetadata',
        'account.individualMetadata'
      ]
    });

    return {
      data: Array.from(clients).map((client) => ({
        id: client.uuid,
        name: client.getAccountName() ?? ''
      })),
      pagination: {
        totalEntries: count,
        totalPages: Math.ceil(count / 10),
        page: 1,
        limit: 10
      }
    };
  }

  async findAllWithRiskAssessmentsPaginated(params: GetRiskClientsRequest): Promise<ClientSelectRiskPaginatedResponse> {
    const { type, country, limit = 10, page = 1, pep, riskRating } = params;
    const query = <any>{
      account: { deletedAt: null }
    };

    if (type)
      query.account.entityType = type;

    if (country) {
      query.$or = [
        { 'account.businessMetadata.countryOfRegistration': country },
        { 'account.individualMetadata.country': country }
      ];
    }

    if (pep)
      query['account.riskAssessments.pep'] = true;

    if (riskRating)
      query['account.riskAssessments.rating'] = riskRating;

    const [clients, count] = await this.findAndCount(query, {
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
        account: { riskAssessments: { createdAt: 'desc' } }
      },
      populate: [
        'users',
        'account',
        'account.businessMetadata',
        'account.individualMetadata',
        'account.riskAssessments'
      ]
    });

    const data = Array.from(clients).flatMap((client) => {
      const recentRisk = client.account?.riskAssessments[0];

      return Array.from(client.users).map((user) => ({
        clientId: client.uuid,
        userId: user.uuid,
        email: user.username,
        name: client.getAccountName() ?? '',
        type: client.account?.entityType ?? '',
        riskRating: recentRisk?.rating ?? '',
        lastRA: recentRisk?.createdAt?.toISOString() ?? '',
        nextRA: recentRisk?.completionDate?.toISOString() ?? '',
        PEP: recentRisk?.pep === 'yes',
        country:
          client.account?.businessMetadata?.countryOfRegistration ??
          client.account?.individualMetadata?.country ??
          ''
      }));
    });

    return {
      data,
      pagination: {
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  async findAllWithRiskAssessments({page = 1, limit = 10}): Promise<ClientSelectRiskPaginatedResponse> {
    const query = <any>{
      account: {
        deletedAt: null
      }
    };

    query.createdAt = {
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    };

    const [clients, count] = await this.findAndCount(query, {
      limit,
      offset: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
        account: {
          riskAssessments: { createdAt: 'desc' }
        }
      },
      populate: [
        'account',
        'account.businessMetadata',
        'account.individualMetadata',
        'account.riskAssessments',
        'users',
        'users.userClients'
      ]
    });

    return {
      data: Array.from(clients).map((client) => {
        const currentRisk = client.account?.getRecentRiskAssessment() ?? new RiskAssessment();
        
        return {
          id: client.uuid,
          type: client.account?.entityType ?? '',
          name: client.getAccountName() ?? '',
          riskRating: currentRisk.rating ?? '',
          lastRA: currentRisk.createdAt?.toISOString() ?? '',
          nextRA: currentRisk.completionDate?.toISOString() ?? '',
          PEP: currentRisk.pep === 'yes',
          country: client.getCoutry() ?? '',
          userId: client.users[0]?.uuid ?? '',
          canImpersonate: !!client.account?.gateway
        };
      }),
      pagination: {
        totalEntries: count,
        totalPages: Math.ceil(count / limit),
        page,
        limit
      }
    };
  }

  async findAndCountNonSubAccount(name: string, entityType: string, country: string, page: number, limit: number) {
    const search = <any>{
      $and: [
        { users: { role: { $in: UserRoles } } },
        { users: { contact: { isSubAccount: false, deletedAt: null } } },
        { deletedAt: null },
        { users: { archivedAt: null } }
      ]
    };
    if (country) {
      search.$and.push({
        $or: [
          {
            users: {
              contact: {
                country: country,
              }
            }
          },
          {
            account: {
              businessMetadata: {
                countryOfRegistration: country,
              }
            }
          },
          {
            account: {
              individualMetadata: {
                country: country,
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
            account: {
              businessMetadata: {
                companyName: {
                  $like: `%${name}%`
                }
              }
            }
          }
        ]
      });
    }

    if (entityType) {
      search.$and.push({
        account: {
          entityType
        }
      });
    }

    return this.findAndCount(search, {
      limit,
      offset: (page - 1) * limit,
      populate: [
        'users',
        'users.contact',
        'account',
        'account.businessMetadata',
        'account.individualMetadata',
        'account.riskAssessments'
      ],
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findByUuidWithMetadata(uuid: string) {
    return this.findOne(
      { uuid, deletedAt: null },
      {
        populate: [
          'account',
          'account.businessMetadata',
          'account.individualMetadata',
          'account.bankMetadata',
          'documents',
          'documents.document',
          'account.riskAssessments',
          'account.riskAssessments.raAttachDocument',
          'userClients',
          'users',
          'userClients.metadata'
        ],
        orderBy: {
          account: {
            riskAssessments: { createdAt: 'desc' }
          }
        }
      }
    );
  }

  async findByUuidWithRiskAssessments(uuid: string) {
    return this.findOne(
      { uuid, deletedAt: null },
      {
        populate: [
          'account.riskAssessments',
          'account.riskAssessments.raAttachDocument',
          'account.businessMetadata',
          'account.individualMetadata',
          'account.bankMetadata',
          'account.directors',
          'account.shareholders',
          'account.shareholders.businessMetadata',
          'account.shareholders.individualMetadata',
          'account.brokers',
          'users',
          'users.userClients',
          'users.userClients.metadata',
          'documents',
          'documents.document'
        ],
        orderBy: {
          account: {
            riskAssessments: { createdAt: 'desc' }
          }
        }
      }
    );
  }

  async findByUuid(uuid: string) {
    return this.findOne({ uuid, deletedAt: null });
  }

  async requestsForApproval() {
    const count = await this.count({
      deletedAt: null,
      account: {
        gateway: null
      }
    });

    return count;
  }

  async riskAssessmentPending() {
    const count = await this.count({
      deletedAt: null,
      account: {
        riskAssessments: null
      }
    });

    return count;
  }
}

import { EntityRepository } from '@mikro-orm/knex';
import { User } from '../../users';
import { Beneficiary } from '../entities';
import { GetBeneficiariesPaginatedResponse, GetBeneficiariesResponse, GetBeneficiariesRequest } from '../types';
import { FilterQuery } from '@mikro-orm/core';
import { ECountryCode, ECurrencyCode } from '@luxbank/misc';
import { FilterBeneficiariesDTO } from '../dtos/filter-beneficiaries.request.dto';
import { GetBeneficiariesSelectPaginatedResponse, GetBeneficiariesSelectResponse, GetBeneficiariesSelectRequest } from '../types';
import { FilterBeneficiariesAccountDTO } from '../dtos/filter-beneficiaries-account.dto';

export class BeneficiariesRepository extends EntityRepository<Beneficiary> {
  async countActiveByUser(user: User) {
    if (!user.contact?.account)
      return 0;

    return this.count({
      account: user.contact.account,
      deletedAt: null
    });
  }

  async findActiveByUserAndCurrency(user: User, currency: string) {
    if (!user.getCurrentClient()?.account) {
      return {
        beneficiaries: [],
        count: 0
      };
    }

    const [beneficiaries, count] = await this.findAndCount({
      account: user.getCurrentClient()?.account,
      deletedAt: null
    });

    return { beneficiaries, count };
  }

  async findActiveByUserToSelectPaginated(params: GetBeneficiariesSelectRequest, user: User): Promise<GetBeneficiariesSelectPaginatedResponse> {
    const { name } = params;
    const page = 1, limit = 10, order = 'desc', orderBy = 'createdAt';
    const filters: FilterQuery<Beneficiary> = { deletedAt: null };

    if (user.role == 'admin:super') {
      filters.account = {
        deletedAt: null,
        archivedAt: null
      };
    } 
    else {
      filters.account = user.getCurrentClient()?.account;
    }

    if (name) {
      filters.$or = [
        { firstname: { $like: `%${name.toLocaleLowerCase()}%` } },
        { lastname: { $like: `%${name.toLocaleLowerCase()}%` } },
        { companyName: { $like: `%${name.toLocaleLowerCase()}%` } }
      ];
    }

    const [beneficiaries, count] = await this.em.findAndCount(
      Beneficiary,
      filters,
      {
        populate: [
          'account',
          'account.businessMetadata',
          'account.individualMetadata'
        ],
        orderBy: {
          [orderBy]: order
        },
        limit,
        offset: (page - 1) * limit
      }
    );

    const beneficiariesResponse: GetBeneficiariesSelectResponse[] =
      beneficiaries.map((beneficiary) => ({
        id: beneficiary.uuid.toString(),
        name: beneficiary.companyName || `${beneficiary.firstname} ${beneficiary.lastname}`
      }));

    return {
      beneficiaries: beneficiariesResponse,
      pagination: {
        page,
        limit,
        totalEntries: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async findActiveByUserPaginated(params: GetBeneficiariesRequest, user: User): Promise<GetBeneficiariesPaginatedResponse> {
    const {
      page = 1,
      limit = 10,
      name,
      currency,
      bankCountry,
      status,
      order = 'desc',
      orderBy = 'createdAt',
      account,
      beneficiary
    } = params;

    const filters: FilterQuery<Beneficiary> = { deletedAt: null };

    if (user.role == 'admin:super') {
      filters.account = {
        deletedAt: null,
        archivedAt: null,
        ...(account ? { uuid: account } : {})
      };
    } 
    else {
      filters.account = user.getCurrentClient()?.account;
    }

    if (name) {
      filters.$or = [
        { firstname: { $like: `%${name.toLocaleLowerCase()}%` } },
        { lastname: { $like: `%${name.toLocaleLowerCase()}%` } },
        { companyName: { $like: `%${name.toLocaleLowerCase()}%` } }
      ];
    }

    if (currency)
      filters.currency = currency;

    if (bankCountry)
      filters.bankCountry = bankCountry;

    if (status)
      filters.isApproved = status === 'approved';

    if (beneficiary)
      filters.uuid = beneficiary;

    const dynamicOrderBy = {};
    dynamicOrderBy[orderBy] = order;

    const [beneficiaries, count] = await this.em.findAndCount(
      Beneficiary,
      filters,
      {
        populate: [
          'account',
          'account.businessMetadata',
          'account.individualMetadata'
        ],
        orderBy: dynamicOrderBy,
        limit: limit,
        offset: (page - 1) * limit
      }
    );

    const beneficiariesResponse: GetBeneficiariesResponse[] = beneficiaries.map(
      (beneficiary) => {
        console.log('beneficiary: ', beneficiary.client_uuid);
        return {
          id: beneficiary.uuid.toString(),
          name: beneficiary.getName(),
          bankCountry: beneficiary.bankCountry as ECountryCode,
          currency: beneficiary.currency as ECurrencyCode,
          status: !!beneficiary.isApproved ? 'approved' : 'pending',
          currencyCloudId: beneficiary.currencyCloudId ?? '',
          account:
            beneficiary.account.individualMetadata?.getName() ||
            beneficiary.account.businessMetadata?.getName()
        };
      }
    );

    return {
      beneficiaries: beneficiariesResponse,
      pagination: {
        page,
        limit,
        totalEntries: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async findActiveByUser(user: User, query?: FilterBeneficiariesDTO | null) {
    if (user.role == 'admin:super') {
      const [beneficiaries, count] = await this.findAndCount(
        {
          deletedAt: null,
          account: {
            deletedAt: null,
            archivedAt: null,
          }
        },
        {
          populate: [
            'account',
            'account.businessMetadata',
            'account.individualMetadata',
          ],
          orderBy: {
            updatedAt: 'desc',
            createdAt: 'desc'
          }
        }
      );
      return { beneficiaries, count };
    }

    const filters: FilterQuery<Beneficiary> = {
      account: user.getCurrentClient()?.account,
      deletedAt: null
    };

    if (query?.status)
      filters.isApproved = query.status === 'approved';

    if (query?.currency)
      filters.currency = query.currency;

    if (query?.bank_country)
      filters.bankCountry = query.bank_country;

    const [beneficiaries, count] = await this.findAndCount(filters, {
      orderBy: {
        updatedAt: 'desc',
        createdAt: 'desc',
      }
    });

    return { beneficiaries, count };
  }

  async findOneByUserAndId(user: User, uuid: string) {
    if (user.role !== 'admin:super') {
      if (!user.getCurrentClient()?.account)
        return null;

      return this.findOne(
        {
          account: user.getCurrentClient()?.account,
          uuid,
          deletedAt: null
        },
        {
          populate: [
            'account',
            'creator',
            'creator.contact',
            'creator.clients'
          ]
        }
      );
    } 
    else {
      return this.findOne(
        {
          uuid,
          deletedAt: null
        },
        {
          populate: [
            'account',
            'creator',
            'creator.contact',
            'creator.clients'
          ]
        }
      );
    }
  }

  async findOneById(uuid: string) {
    return this.findOne(
      {
        uuid,
        deletedAt: null
      },
      {
        populate: ['account', 'creator', 'creator.contact']
      }
    );
  }

  async deleteBeneficiary(beneficiary: Beneficiary) {
    beneficiary.deletedAt = new Date();
    await this.em.persistAndFlush(beneficiary);
  }

  async persistAndFlush(beneficiary: Beneficiary) {
    await this.em.persistAndFlush(beneficiary);
  }

  async findBeneficiariesByAccount(accountUuid: string, query: FilterBeneficiariesAccountDTO) {
    const filters: FilterQuery<Beneficiary> = {
      deletedAt: null,
      account: {
        uuid: accountUuid,
        deletedAt: null,
        archivedAt: null
      }
    };

    if (query?.status)
      filters.isApproved = query.status === 'approved';

    if (query?.currency)
      filters.currency = query.currency;

    if (query?.bankCountry)
      filters.bankCountry = query.bankCountry;

    const [beneficiaries, count] = await this.findAndCount(filters, {
      orderBy: {
        updatedAt: 'desc',
        createdAt: 'desc'
      }
    });

    return { beneficiaries, count };
  }

  async beneficiariesPending() {
    const count = await this.count({
      deletedAt: null,
      isApproved: false
    });

    return count;
  }
}

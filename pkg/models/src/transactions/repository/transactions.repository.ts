import { EntityRepository } from '@mikro-orm/knex';
import { User } from '../../users';
import { Beneficiary } from '../../beneficiaries';
import { Transaction } from '../entities/transaction.entity';
import { QueryFlag } from '@mikro-orm/core';
import { GetBeneficiariesPaginatedResponse, PaginationsResponse } from '../dtos/get-current-beneficiaries';
import { ECurrencyCode } from '@cdaxfx/tools-misc';
import { generateShortUniqId } from '@cdaxfx/tools-misc';

export class TransactionsRepository extends EntityRepository<Transaction> {
  async createTransaction(data: any, creator: User): Promise<Transaction> {
    const result = new Transaction();

    result.action = data.action;
    // result.account_id = data.account_id;
    result.balance_id = data.balance_id;
    result.amount = data.amount;
    result.destination_balance_id = data.destination_balance_id;
    result.buy_amount = data.buy_amount;
    result.buy_currency = data.buy_currency;
    result.currency = data.currency;
    result.fixed_side = data.fixed_side;
    result.transaction_id = data.transaction_id;
    result.short_id = data.short_id;
    result.gateway = data.gateway;
    result.reason = data.reason;
    result.reference = data.reference;
    result.status = data.status;
    result.fee_amount = data.fee_amount;
    result.fee_currency = data.fee_currency;
    result.gateway_fee_amount = data.gateway_fee_amount;
    result.gateway_fee_currency = data.gateway_fee_currency;
    result.client_rate = data.client_rate;
    result.core_rate = data.core_rate;
    result.creator = creator;
    result.beneficiary_id = data.beneficiary_id;
    result.payment_date = data.payment_date;
    result.payment_type = data.payment_type;
    result.payment_reason = data.payment_reason;
    result.purpose_code = data.purpose_code;
    result.status_approval = data.status_approval;
    result.client_uuid = data.client_uuid;
    result.gateway_id = data.gateway_id;
    // result.cdax_beneficiary_id = data.cdax_beneficiary_id;
    result.gateway_completed_at = data.gateway_completed_at;
    result.conversion_date = data.conversion_date;
    result.settlement_date = data.settlement_date;
    result.cdax_id = generateShortUniqId(8);
    return result;
  }

  async findRecentBeneficiariesByUserId(clientId: string): Promise<GetBeneficiariesPaginatedResponse> {
    const page = 1;
    const limit = 6;
    const _ids = await this.find(
      {
        client_uuid: clientId,
        beneficiary_id: { $ne: null },
        beneficiary: { isApproved: true },
        action: 'payment'
      },
      {
        orderBy: { createdAt: 'DESC' },
        limit: 10,
        fields: ['cdax_beneficiary_id'],
        flags: [QueryFlag.DISTINCT],
      }
    );

    const beneficiaries =
      _ids.length > 0
        ? await this.em
            .createQueryBuilder(Beneficiary, 'b')
            .where({
              uuid: {
                $in: _ids.map(({ cdax_beneficiary_id }) => cdax_beneficiary_id)
              },
              isApproved: true,
              deletedAt: null
            })
            .select([
              'b.uuid',
              'b.lastname',
              'b.firstname',
              'b.bank_country',
              'b.currency',
              'b.currency_cloud_id',
              'b.company_name',
              'b.currency_cloud_id',
              'b.isApproved'
            ])
            .getResultList()
        : [];

    const pagination: PaginationsResponse = {
      page,
      limit
    };

    return {
      beneficiaries: beneficiaries.map((b) => ({
        id: b.uuid.toString(),
        name:
          (!!b.firstname || !!b.lastname ? `${b.firstname} ${b.lastname}` : b.companyName).trim() || '',
        bankCountry: b.bankCountry,
        currency: b.currency as ECurrencyCode,
        status: b.isApproved ? 'approved' : 'pending',
        currencyCloudId: b.currencyCloudId ?? ''
      })),
      pagination
    };
  }
}

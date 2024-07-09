import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  CurrencyCloudDTO,
  TransactionAction,
  TransactionsRepository,
  Transaction,
  ClientsRepository,
  TransactionStatusApproval,
  TransactionStatusLabel,
  TransactionStatusMap,
  TransactionStatus,
} from '@tools/models';
import { generateShortUniqId } from '@tools/misc/utils/ShortUniqId';

@Injectable()
export class WebhooksCurrencyCloudService {
  logger = new Logger(WebhooksCurrencyCloudService.name);
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async updateOrCreateConversionFromWebhook(data: CurrencyCloudDTO) {
    this.logger.log(`:: Update Conversion :: ${JSON.stringify(data)}`);

    let tx = await this.transactionsRepository.findOne({
      transaction_id: data.id,
      action: TransactionAction.Conversion,
    });

    if (
      tx &&
      TransactionStatusMap['completed'].includes(tx.status as TransactionStatus)
    ) {
      return;
    }

    if (!tx) {
      const client = await this.clientsRepository.findOne({
        account: {
          cloudCurrencyId: data.creator_contact_id,
        },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      tx = new Transaction();
      tx.gateway = 'currencycloud';
      tx.action = TransactionAction.Conversion;
      tx.client_uuid = client.uuid;
      tx.creator_uuid = `${process.env.BACKOFFICE_UUID}`;
      tx.amount = data.client_sell_amount;
      tx.currency = data.sell_currency;
      tx.buy_amount = data.client_buy_amount;
      tx.buy_currency = data.buy_currency;
      tx.fixed_side = data.fixed_side;
      tx.status = data.status;
      tx.short_id = data.short_reference;
      tx.account_id = data.account_id;
      tx.transaction_id = data.id;
      tx.deposit_required = data.deposit_required;
      tx.deposit_amount = data.deposit_amount;
      tx.deposit_currency = data.deposit_currency;
      tx.deposit_status = data.deposit_status;
      tx.deposit_required_at = data.deposit_required_at;
      tx.settlement_date = data.settlement_date;
      tx.conversion_date = data.conversion_date;
      tx.core_rate = data.core_rate;
      tx.client_rate = data.client_rate;
      tx.partner_rate = data.partner_rate;
      tx.mid_market_rate = data.mid_market_rate;
      tx.gateway_created_at = data.created_at;
      tx.gateway_updated_at = data.updated_at;
      tx.gateway_spread_table = data.spread_table;
      tx.status_approval = TransactionStatusApproval.Done;
      tx.cdax_id = generateShortUniqId(8);
    } else {
      tx.status = data.status;
      tx.settlement_date = data.settlement_date;
      if (
        TransactionStatusLabel[data.status] === 'completed' ||
        TransactionStatusLabel[data.status] === 'deleted'
      ) {
        tx.gateway_completed_at = new Date().toISOString();
      }
    }

    await this.transactionsRepository.persistAndFlush(tx);
    return tx;
  }

  async updateOrCreatePaymentFromWebhook(data: CurrencyCloudDTO) {
    this.logger.log(`:: Update Payment :: ${JSON.stringify(data)}`);

    let tx = await this.transactionsRepository.findOne({
      transaction_id: data.id,
      action: TransactionAction.Payment,
    });

    if (
      tx &&
      TransactionStatusMap['completed'].includes(tx.status as TransactionStatus)
    ) {
      return;
    }

    if (!tx) {
      const client = await this.clientsRepository.findOne({
        account: {
          cloudCurrencyId: data.creator_contact_id,
        },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      tx = new Transaction();
      tx.gateway = 'currencycloud';
      tx.action = TransactionAction.Payment;
      tx.client_uuid = client.uuid;
      tx.creator_uuid = `${process.env.BACKOFFICE_UUID}`;
      tx.account_id = data.creator_contact_id;
      tx.transaction_id = data.id;
      tx.amount = data.amount;
      tx.currency = data.currency;
      tx.reference = data.reference;
      tx.reason = data.reason;
      tx.status = data.status;
      tx.short_id = data.short_reference;
      tx.payment_type = data.payment_type;
      tx.payment_date = data.payment_date;
      tx.transferred_at = data.transferred_at;
      tx.status_approval = TransactionStatusApproval.Done;
      tx.cdax_id = generateShortUniqId(8);
    } else {
      tx.status = data.status;
      tx.settlement_date = data.transferred_at;
      tx.gateway_completed_at = data.transferred_at;
    }

    await this.transactionsRepository.persistAndFlush(tx);
    return tx;
  }

  async updateOrCreateFundingFromWebhook(data: CurrencyCloudDTO) {
    this.logger.log(`:: Update Funding :: ${JSON.stringify(data)}`);

    let tx = await this.transactionsRepository.findOne({
      transaction_id: data.id,
      action: TransactionAction.Funding,
    });

    if (
      tx &&
      TransactionStatusMap['completed'].includes(tx.status as TransactionStatus)
    ) {
      return;
    }

    if (!tx) {
      const client = await this.clientsRepository.findOne({
        account: {
          cloudCurrencyId: data.creator_contact_id,
        },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      tx = new Transaction();
      tx.gateway = 'currencycloud';
      tx.action = TransactionAction.Funding;
      tx.client_uuid = client.uuid;
      tx.creator_uuid = `${process.env.BACKOFFICE_UUID}`;
      tx.balance_id = data.balance_id;
      tx.account_id = data.account_id;
      tx.transaction_id = data.id;
      tx.amount = data.amount;
      tx.currency = data.currency;
      tx.beneficiary_id = data.beneficiary_id;
      tx.payment_type = data.payment_type;
      tx.status = data.status;
      tx.short_id = data.related_entity_short_reference;
      tx.reason = data.reason;
      tx.settlement_date = data.settles_at;
      tx.gateway_created_at = data.created_at;
      tx.gateway_updated_at = data.updated_at;
      tx.gateway_completed_at = data.completed_at;
      tx.reference = data.additional_information;
      tx.sender_information = data.sender;
      tx.status_approval = TransactionStatusApproval.Done;
      tx.cdax_id = generateShortUniqId(8);
    } else {
      tx.status = data.status;
      tx.settlement_date = data.settles_at;
      tx.gateway_completed_at = data.completed_at;
    }

    await this.transactionsRepository.persistAndFlush(tx);
    return tx;
  }
}

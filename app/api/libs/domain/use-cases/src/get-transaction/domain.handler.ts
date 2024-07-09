import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ECountryCode, ECurrencyCode } from '@tools/misc';
import {
  BusinessMetadata,
  IndividualMetadata,
  TransactionStatusLabel,
  TransactionsRepository,
} from '@tools/models';
import {
  EPaymentType,
  ERoutingCodesNames,
} from '../types/transaction.interface';
import { GetTransactionUseCase } from './abstract.handler';
import { GetTransactionResponse } from './types/transaction.response.type';

@Injectable()
export class GetTransactionDomainUseCase extends GetTransactionUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(private readonly transactionRepository: TransactionsRepository) {
    super();
  }

  async handle(id: string, user): Promise<GetTransactionResponse> {
    const transactionDetail = await this.transactionRepository.findOne(
      {
        uuid: id,
      },
      {
        populate: ['creator', 'beneficiary', 'account'],
      },
    );

    if (!transactionDetail) {
      throw new NotAcceptableException({
        messages: ['Transaction not found'],
      });
    }

    const payer: IndividualMetadata | BusinessMetadata | undefined =
      transactionDetail.client.account?.individualMetadata ??
      transactionDetail.client.account?.businessMetadata;

    const beneficiary = transactionDetail.beneficiary;
    return {
      type: transactionDetail.action,
      status: TransactionStatusLabel[transactionDetail.status],
      shortId: transactionDetail.uuid,
      isPendingApproval: transactionDetail.status_approval === 'pending',
      createDate: transactionDetail.createdAt.toISOString(),
      settlementDate: transactionDetail.settlement_date,
      paymentDate: transactionDetail.payment_date,
      in: {
        currency: transactionDetail.buy_currency as ECurrencyCode,
        amount: transactionDetail.buy_amount,
      },
      out: {
        currency: transactionDetail.currency as ECurrencyCode,
        amount: transactionDetail.amount,
      },
      creator: {
        name: transactionDetail.creator?.getFullName(),
        email: transactionDetail.creator?.username,
      },
      conversion: {
        conversionRate: transactionDetail.core_rate,
        exchangeRateDate: transactionDetail.gateway_completed_at,
        conversionDate: transactionDetail.conversion_date,
      },
      payment: {
        type: [transactionDetail.payment_type as EPaymentType],
        reason: transactionDetail.reason,
        paymentReference: transactionDetail.reference,
        payer: {
          name: payer?.getName() ?? '',
          country: transactionDetail.client.account?.individualMetadata
            ? transactionDetail.client.account?.individualMetadata.country
            : transactionDetail.client.account?.businessMetadata
                ?.countryOfRegistration ?? '',
        },
        beneficiary: {
          name: beneficiary?.getName(),
          entityType: beneficiary?.entityType as any,
          address: beneficiary?.address,
          city: beneficiary?.city,
        },
        beneficiaryBank: {
          country: beneficiary?.country as ECountryCode,
          routingCodes: beneficiary
            ? ([
                {
                  name: ERoutingCodesNames.IBAN,
                  value: beneficiary.IBAN,
                },
                {
                  name: ERoutingCodesNames.BIC_SWIFT,
                  value: beneficiary.bicSwift,
                },
                {
                  name: ERoutingCodesNames.ACCOUNT_NUMBER,
                  value: beneficiary.accountNumber,
                },
                {
                  name: ERoutingCodesNames.SORT_CODE,
                  value: beneficiary.sortCode,
                },
              ] as any)
            : [],
        },
        cdaxId: transactionDetail.cdax_id,
      },
    };
  }
}

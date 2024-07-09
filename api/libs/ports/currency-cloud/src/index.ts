import { CreateConversionRequest } from '@domain/use-cases/create-conversion';
import { GetPreviewRequest } from '@domain/use-cases/get-conversion-preview';
import { Logger } from '@nestjs/common';
import { User } from '@tools/models';
import { CoreRequester } from './core-requester';
import { FundingAccountsRequest } from './requests/funding-accounts.request';
import { PurposeCodeRequest } from './requests/purpose-code.request';
import { GetTransactionsRequest } from './requests/transactions.request';
import { FundingAccountsFindResponse } from './responses/funding-accounts.response';
import { PurposeCodesResponse } from './responses/purpose-code.response';
import { RatesDetailedResponse } from './responses/rates-detailed.response';
import { ReferenceConversionDatesResponse } from './responses/reference-conversion-dates';
import {
  GetTransactionsResponse,
  Transaction,
} from './responses/transactions.response';
import { CreateBeneficiaryResponse } from './responses/beneficiary.response';
import { CreateBeneficiaryRequest } from './requests/beneficiary.request';
import { CurrencyCloudErrorResponse } from './utils/error.response';

export class PaymentProviderCurrencyCloud extends CoreRequester {
  constructor() {
    super(new Logger(PaymentProviderCurrencyCloud.name));
  }

  static getInstance() {
    return new PaymentProviderCurrencyCloud();
  }

  async updateBeneficiary(
    id: string,
    beneficiary: any,
    contactId: string | null,
    user: User,
  ): Promise<string | undefined> {
    if (contactId) {
      beneficiary.onBehalfOf = contactId;
    }
    try {
      const response = await this.postRequest(
        `beneficiaries/${id}`,
        beneficiary,
        {},
        user,
        {},
      );
      if (response.status === 200) {
        // return [response.data.id, response.data.payment_types.join(',')];
        return response.data.id;
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async deleteBeneficiary(
    id: string,
    contactId: string | null,
    user: User,
  ): Promise<any | undefined> {
    const params: { onBehalfOf?: string } = {};

    if (contactId) {
      params.onBehalfOf = contactId;
    }

    try {
      const result = await this.postRequest(
        `beneficiaries/${id}/delete`,
        params,
        {},
        user,
        {},
      );

      if (result.status === 200) {
        return result.data;
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async createBeneficiary(
    data: CreateBeneficiaryRequest,
    user: User,
  ): Promise<CreateBeneficiaryResponse | undefined> {
    try {
      const result = await this.postRequest(
        'beneficiaries/create',
        data,
        {},
        user,
      );

      if (result.status === 200) {
        return result.data;
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }

    return undefined;
  }

  async getWalletDetail(
    params: FundingAccountsRequest,
    user: User,
  ): Promise<FundingAccountsFindResponse> {
    try {
      const result = await this.getRequest<FundingAccountsFindResponse>(
        'funding_accounts/find',
        {},
        user,
        params,
      );

      if (!result) {
        return {
          funding_accounts: [],
          pagination: {
            total_entries: 0,
            total_pages: 0,
            current_page: 0,
            per_page: 0,
            previous_page: 0, // Add this line
            next_page: 0, // Add this line
            order: '', // Add this line
            order_asc_desc: '', // Add this line
          },
        };
      }

      return result;
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getPurposeCodes(
    params: PurposeCodeRequest,
    user: User,
  ): Promise<PurposeCodesResponse> {
    try {
      return await this.getRequest<PurposeCodesResponse>(
        `reference/payment_purpose_codes`,
        {},
        user,
        params,
      );
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getTransaction(id: string, user: User): Promise<Transaction> {
    try {
      return await this.getRequest<Transaction>(`transactions/${id}`, {}, user);
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getTransactions(
    params: GetTransactionsRequest,
    user: User,
  ): Promise<GetTransactionsResponse> {
    try {
      return await this.getRequest<GetTransactionsResponse>(
        'transactions/find',
        {},
        user,
        params,
      );
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getConversionDates(
    conversion_pair: string,
    user: User,
  ): Promise<ReferenceConversionDatesResponse> {
    try {
      return await this.getRequest<ReferenceConversionDatesResponse>(
        `reference/conversion_dates`,
        {},
        user,
        {
          conversion_pair,
        },
      );
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getCurrencyQuote(
    data: GetPreviewRequest,
    user: User,
  ): Promise<RatesDetailedResponse> {
    const { buyCurrency, sellCurrency, direction, amount, date } = data;
    const params = {
      buy_currency: buyCurrency?.substring(0, 3),
      sell_currency: sellCurrency?.substring(0, 3),
      fixed_side: direction,
      amount,
      ...(date && date !== 'today' ? { conversion_date: date } : {}),
    };

    try {
      return await this.getRequest<RatesDetailedResponse>(
        `rates/detailed`,
        {},
        user,
        params,
      );
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async postCurrencyQuote(data: CreateConversionRequest, user: User) {
    const body = {
      buy_currency: data.buyCurrency.substring(0, 3),
      sell_currency: data.sellCurrency.substring(0, 3),
      fixed_side: data.direction,
      amount: data.amount,
      term_agreement: true,
      ...(data.date ? { conversion_date: data.date } : {}),
    };

    try {
      const response = await this.postRequest(
        'conversions/create',
        body,
        {},
        user,
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async createPayment(data: any, user: User, transactionId: string) {
    try {
      console.log(data);
      delete data.account_id;
      if (!data.purpose_code || data.purpose_code == '-1') {
        delete data.purpose_code;
      }
      const response = await this.postRequest(
        'payments/create',
        { ...data, unique_request_id: transactionId },
        {},
        user,
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getBalances(user: User) {
    try {
      const response = await this.getRequest(
        `balances/find?per_page=50`,
        {},
        user,
      );
      if (!!response) {
        return {
          balances: response.balances.map((d) => ({
            ...d,
            id: d.currency + d.id,
          })),
        };
      }
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }

  async getBalance(currency: string, user: User) {
    try {
      const response = await this.getRequest(`balances/${currency}`, {}, user);

      return response;
    } catch (err) {
      throw new CurrencyCloudErrorResponse(err);
    }
  }
}

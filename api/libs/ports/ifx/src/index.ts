import { CoreRequester } from '@ports/ifx/core-requester';
import { PaginationParams } from './requests/pagination.request';
import { PaginationWrapper } from './responses/pagination.response';
import { Wallet, WalletBalances } from './responses/wallets.response';
import { AxiosRequestConfig } from 'axios';
import { Beneficiary, BeneficiaryUpdate } from './requests/beneficiary.request';
import { BeneficiaryCreated } from './responses/beneficiary.response';
import { User } from '@tools/models';
import { Payment } from './requests/payment.request';
import { PaymentCreated, PaymentDetail } from './responses/payment.response';
import { Conversion } from './requests/conversion.request';
import {
  AcceptQuote,
  ConversionDetail,
  QuoteCreated,
  QuotePreview,
} from './responses/conversion.response';
import { AccountBeneficiary } from './requests/account-beneficiary.request';
import { IFXErrorResponse } from './utils/error.response';

export class PaymentProviderIFX {
  private coreRequester: CoreRequester;

  constructor(protected readonly user: User) {
    this.coreRequester = new CoreRequester(user);
  }

  static getInstance(user: User) {
    return new PaymentProviderIFX(user);
  }

  async getWallets(
    params?: PaginationParams,
  ): Promise<PaginationWrapper<Wallet>> {
    try {
      const { data } = await this.coreRequester.get('/wallets', {
        params,
      } as AxiosRequestConfig);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async getWalletBalances(id: string): Promise<WalletBalances> {
    try {
      const { data } = await this.coreRequester.get(`/wallets/${id}`);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async createBeneficiary(body: Beneficiary): Promise<BeneficiaryCreated> {
    try {
      const { data } = await this.coreRequester.post('/beneficiaries', body);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async createAccountBeneficiary(
    id: string,
    body: AccountBeneficiary,
  ): Promise<BeneficiaryCreated> {
    try {
      const { data } = await this.coreRequester.post(
        `/beneficiaries/${id}/accounts`,
        body,
      );
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async updateBeneficiary(id: string, body: BeneficiaryUpdate) {
    try {
      await this.coreRequester.patch(`/beneficiaries/${id}`, body);
      return { id };
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async deleteBeneficiary(id: string) {
    try {
      await this.coreRequester.delete(`/beneficiaries/${id}`);
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }
  async listBeneficiaries(
    params?: PaginationParams,
  ): Promise<PaginationWrapper<Beneficiary>> {
    try {
      const { data } = await this.coreRequester.get('/beneficiaries', {
        params,
      } as AxiosRequestConfig);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async detailBeneficiary(
    id: string,
    params?: PaginationParams,
  ): Promise<Beneficiary> {
    try {
      const { data } = await this.coreRequester.get(`/beneficiaries/${id}`, {
        params,
      } as AxiosRequestConfig);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async detailAccountBeneficiary(
    id: string,
    params?: PaginationParams,
  ): Promise<AccountBeneficiary[]> {
    try {
      const { data } = await this.coreRequester.get(
        `/beneficiaries/${id}/accounts`,
        {
          params,
        } as AxiosRequestConfig,
      );
      return data.data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async createPayment(body: Payment): Promise<PaymentCreated> {
    try {
      const { data } = await this.coreRequester.post('/third-party-payments', {
        ...body,
        ultimateDebtorName: 'CDAX Limited',
        ultimateDebtorBuildingNumber: '27',
        ultimateDebtorStreetName: 'Hope St',
        ultimateDebtorCity: 'Isle of Man',
        ultimateDebtorCountry: 'IM',
        ultimateDebtorPostCode: 'IM1 1AR',
        ultimateDebtorIdentificationNumber: '135485C',
      });
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async createQuote(body: Conversion): Promise<QuoteCreated> {
    try {
      const { data } = await this.coreRequester.post('/quotes', body);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async previewQuote(id: string): Promise<QuotePreview> {
    try {
      const { data } = await this.coreRequester.get(`/quotes/${id}`);
      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async acceptQuote(id: string): Promise<AcceptQuote> {
    try {
      const { data } = await this.coreRequester.patch(
        `/quotes/${id}/accept`,
        {},
      );

      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async getConversionDetail(id: string): Promise<ConversionDetail> {
    try {
      const { data } = await this.coreRequester.get(`/trades/${id}`);

      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }

  async getPaymentDetail(id: string): Promise<PaymentDetail> {
    try {
      const { data } = await this.coreRequester.get(`/payments/${id}`);

      return data;
    } catch (error) {
      throw new IFXErrorResponse(error);
    }
  }
}

import { RoutingCodes } from '../../wallets/dto/wallet-details.response.dto';
import { ECountryCode } from '@luxbank/tools-misc';
import { TransactionCurrencyAmount } from '@luxbank/ports-ifx';

export enum EPaymentType {
    PRIORITY = 'priority',
    REGULAR = 'regular'
}

enum EEntityType {
    INDIVIDUAL = 'individual',
    BUSINESS = 'business'
}

class PaymentDetail {
    type: EPaymentType;
    reason: string;
    reference: string;
}

class PayerAccountDetail {
    accountHolderName: string;
    bankName: string;
    bankCountryCode: ECountryCode;
    bankCountryName: string;
}

class BeneficiaryDetail {
    name: string;
    address: string;
    city: string;
    countryCode: ECountryCode;
    countryName: string;
    entityType: EEntityType;
    routingCodes: RoutingCodes;
}
class ConversionDetailResponseDto {
    conversionRate: string;
    exchangeRateDate: string;
    transactionId: string;
    createDate: Date;
    settlementDate: string;
    conversionDate: string;
    in: TransactionCurrencyAmount;
    out: TransactionCurrencyAmount;
}

export class TransactionDetailResponseDto {
    payment?: PaymentDetail;
    payer?: PayerAccountDetail;
    beneficiary?: BeneficiaryDetail;
    conversionRate?: number;
    conversion?: ConversionDetailResponseDto;
}

export class GetTransactionResponseDto {
    type: string;
    status: string;
    shortId: string;
    createDate: string;
    settlementDate: string;
    in: {
        currency: string;
        amount: string;
    };
    out: {
        currency: string;
        amount: string;
    };

    creator: {
        name: string;
        email: string;
    };
    conversion: {
        conversionRate: string;
        exchangeRateDate: string;
        conversionDate: string;
    };
    payment: {
        type?: EPaymentType[];
        reason: string;
        paymentReference: string;
        payer: {
            name: string;
            country: string;
        };
        beneficiary: {
            name: string;
            entityType: EEntityType;
            address: string;
            city: string;
        };
        beneficiaryBank: {
            country: string;
            routingCodes: RoutingCodes;
        };
    };
}

export class GetTransactionResponseWithDataDto {
    data: GetTransactionResponseDto;
}

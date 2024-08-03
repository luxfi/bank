import { EEntityType, EPaymentType, ERoutingCodesNames, TransactionCurrencyAmount } from '@luxbank/ports-ifx';
import { ECountryCode } from '@luxbank/tools-misc';

export interface RoutingCodes {
    name: ERoutingCodesNames;
    value: string;
}

export interface PaymentDetail {
    type: EPaymentType;
    reason: string;
    reference: string;
}

export interface PayerAccountDetail {
    accountHolderName: string;
    bankName: string;
    bankCountryCode: ECountryCode;
    bankCountryName: string;
}

export interface BeneficiaryDetail {
    name: string;
    address: string;
    city: string;
    countryCode: ECountryCode;
    countryName: string;
    entityType: EEntityType;
    routingCodes: RoutingCodes;
}

export interface ConversionDetailResponse {
    conversionRate: string;
    exchangeRateDate: string;
    transactionId: string;
    createDate: Date;
    settlementDate: string;
    conversionDate: string;
    in: TransactionCurrencyAmount;
    out: TransactionCurrencyAmount;
}
// export interface GetTransactionResponse {
//   payment?: PaymentDetail;
//   payer?: PayerAccountDetail;
//   beneficiary?: BeneficiaryDetail;
//   conversion?: ConversionDetailResponse;
// }

export interface GetTransactionResponse {
    type: string;
    status: string;
    shortId: string;
    createDate: string;
    settlementDate: string;
    isPendingApproval: boolean;
    paymentDate: string;
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
        type: EPaymentType[];
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
        cdaxId: string;
    };
}

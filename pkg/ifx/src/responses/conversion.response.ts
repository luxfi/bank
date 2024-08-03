import { EDirection } from '@luxbank/currency-cloud';
import { ECurrencyCode } from '@luxbank/misc';

export interface ConversionCreated {
  id: string;
}

export interface QuoteCreated {
  id: string;
}

export interface AcceptQuote {
  bookingStatus: string;
  message: string;
}

export interface ConversionDetail {
  id: string;
  buy: Buy;
  sell: Buy;
  rate: number;
  valueDate: string;
  dueDate: Date;
  quote: Quote;
}

export interface Buy {
  amount: number;
  currency: string;
}

export interface Quote {
  id: string;
}

export interface QuotePreview {
  id: string;
  quotedPaymentTrades: QuotedPaymentTrade[];
  quotedStandaloneTrades: QuotedStandaloneTrade[];
  bookedTrades: BookedTrade[];
  bookedStandaloneTrades: BookedTrade[];
  payments: Payment[];
  totals: Total[];
  expiresAt: string;
  accepted: boolean;
  acceptedBy: AcceptedBy;
  acceptedOn: string;
}

export interface AcceptedBy {
  id: string;
  name: string;
}

export interface BookedTrade {
  id: string;
  buyCurrency: string;
  sellCurrency: string;
}

export interface Payment {
  paymentCount: number;
  buy: Total;
  sell: Total;
  settlementDate: string;
}

export interface Total {
  amount: number;
  currency: ECurrencyCode;
}

export interface QuotedPaymentTrade {
  paymentCount: number;
  buy: Total;
  sell: Total;
  rate: number;
  valueDate: string;
  settlementDate: string;
  booked: boolean;
}

export interface QuotedStandaloneTrade {
  buy: Total;
  sell: Total;
  rate: number;
  valueDate: string;
  direction: EDirection;
  booked: boolean;
}

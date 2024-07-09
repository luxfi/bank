import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateCurrencyQuote {
  @ApiProperty()
  @IsOptional()
  buy_currency: string;
  @ApiProperty()
  @IsOptional()
  sell_currency: string;
  @ApiProperty()
  @IsOptional()
  fixed_side: string;
  @ApiProperty()
  @IsOptional()
  amount: string;
  @ApiProperty()
  @IsOptional()
  conversion_date: string;
  @ApiProperty()
  @IsOptional()
  term_agreement: boolean;
  @ApiProperty()
  @IsOptional()
  quoteId: string;
  @ApiProperty()
  @IsOptional()
  buy_account_id: string;
  @ApiProperty()
  @IsOptional()
  sell_account_id: string;
}

export class CreateCurrencyTopUp {
  @ApiProperty()
  @IsOptional()
  currency: string;
  @ApiProperty()
  @IsOptional()
  amount: string;
}
export class CreateCurrencyBeneficiary {
  @ApiProperty()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsOptional()
  bank_account_holder_name: string;
  @ApiProperty()
  @IsOptional()
  bank_country: string;
  @ApiProperty()
  @IsOptional()
  currency: string;
}

export class CreateValidatePayment {
  @ApiProperty()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsOptional()
  currency: string;
  @ApiProperty()
  @IsOptional()
  beneficiary_id: string;
  @ApiProperty()
  @IsOptional()
  amount: string;
  @ApiProperty()
  @IsOptional()
  reason: string;
  @ApiProperty()
  @IsOptional()
  purpose_code: string;
  @ApiProperty()
  @IsOptional()
  reference: string;
  @ApiProperty()
  @IsOptional()
  payment_type: string;
  @ApiProperty()
  @IsOptional()
  payment_types: string[];
  @ApiProperty()
  @IsOptional()
  payment_date: string;
  @ApiProperty()
  @IsOptional()
  conversion_id: string;
  @ApiProperty()
  @IsOptional()
  payer_entity_type: string;
  @ApiProperty()
  @IsOptional()
  payer_company_name: string;
  @ApiProperty()
  @IsOptional()
  payer_first_name: string;
  @ApiProperty()
  @IsOptional()
  payer_last_name: string;
  @ApiProperty()
  @IsOptional()
  payer_city: string;
  @ApiProperty()
  @IsOptional()
  payer_address: string;
  @ApiProperty()
  @IsOptional()
  payer_country: string;
  @ApiProperty()
  @IsOptional()
  payer_date_of_birth: string;
  @ApiProperty()
  @IsOptional()
  account_id?: string;
}

export class DeletePaymentDTO {
  @ApiProperty()
  @IsOptional()
  uuid: string;
}
export class SplitConversionDTO {
  @ApiProperty()
  @IsOptional()
  amount: string;
}
export class DateChangeDTO {
  @ApiProperty()
  @IsOptional()
  new_settlement_date: string;
}

export class DeliveryDateDTO {
  @ApiProperty()
  @IsOptional()
  currency: string;
  @ApiProperty()
  @IsOptional()
  bank_country: string;
  @ApiProperty()
  @IsOptional()
  payment_date: string;
  @ApiProperty()
  @IsOptional()
  payment_type: string;
}

export class RenameLinkedClientDTO {
  @ApiProperty()
  @IsOptional()
  id: string;
  @ApiProperty()
  @IsOptional()
  name: string;
}

export class SourceInfoDTO {
  internalAccountId: string;
  identifierString: string;
  accountHolderId: string;
  type: string;
}
export class WebhookAmountDTO {
  currency: string;
  value: number;
}
export class RoutingCodeDTO {
  routingCodeKey: string;
  routingCodeValue: string;
}
export class WebhookDTO {
  @ApiProperty()
  @IsOptional()
  accountId: string;
  @ApiProperty()
  @IsOptional()
  createdAt: string;
  @ApiProperty()
  @IsOptional()
  type: string;
  @ApiProperty()
  @IsOptional()
  shortId: string;
  @ApiProperty()
  @IsOptional()
  status: string;
  @ApiProperty()
  @IsOptional()
  accountHolderId: string;
  @ApiProperty()
  @IsOptional()
  sourceInfo: SourceInfoDTO;
  @ApiProperty()
  @IsOptional()
  destinationInfo: SourceInfoDTO;
  @ApiProperty()
  @IsOptional()
  amount: WebhookAmountDTO;
  @ApiProperty()
  @IsOptional()
  buyAmount: WebhookAmountDTO;
  @ApiProperty()
  @IsOptional()
  paymentType: string;
  @ApiProperty()
  @IsOptional()
  fixedSide: string;
  @ApiProperty()
  @IsOptional()
  transactionId: string;
  @ApiProperty()
  @IsOptional()
  fee: WebhookAmountDTO;
  @ApiProperty()
  @IsOptional()
  reference: string;
  @ApiProperty()
  @IsOptional()
  comment: string;
  @ApiProperty()
  @IsOptional()
  fxRate: string;
  @ApiProperty()
  @IsOptional()
  source: string;
  @ApiProperty()
  @IsOptional()
  destination: string;

  @ApiProperty()
  @IsOptional()
  senderIban: string;

  @ApiProperty()
  @IsOptional()
  senderBic: string;

  @ApiProperty()
  @IsOptional()
  senderAccountNumber: string;

  @ApiProperty()
  @IsOptional()
  senderName: string;

  @ApiProperty()
  @IsOptional()
  senderAddress: string;

  @ApiProperty()
  @IsOptional()
  senderInformation: string;

  @ApiProperty()
  @IsOptional()
  routingCodeEntries: RoutingCodeDTO[];

  @ApiProperty()
  @IsOptional()
  senderRoutingCodeValue: string;
}
export class WebhookCCDTO {
  @ApiProperty()
  @IsOptional()
  spread_table: string;

  @ApiProperty()
  @IsOptional()
  related_entity_short_reference: string;

  @ApiProperty()
  @IsOptional()
  creator_contact_id: string;

  @ApiProperty()
  @IsOptional()
  client_sell_amount: string;

  @ApiProperty()
  @IsOptional()
  client_buy_amount: string;

  @ApiProperty()
  @IsOptional()
  fixed_side: string;

  @ApiProperty()
  @IsOptional()
  account_id: string;

  @ApiProperty()
  @IsOptional()
  balance_id: string;

  @ApiProperty()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  buy_currency: string;

  @ApiProperty()
  @IsOptional()
  sell_currency: string;

  @ApiProperty()
  @IsOptional()
  created_at: string;

  @ApiProperty()
  @IsOptional()
  updated_at: string;

  @ApiProperty()
  @IsOptional()
  client_rate: string;

  @ApiProperty()
  @IsOptional()
  partner_rate: string;

  @ApiProperty()
  @IsOptional()
  mid_market_rate: string;

  @ApiProperty()
  @IsOptional()
  core_rate: string;

  @ApiProperty()
  @IsOptional()
  conversion_date: string;

  @ApiProperty()
  @IsOptional()
  settlement_date: string;

  @ApiProperty()
  @IsOptional()
  deposit_required: boolean;

  @ApiProperty()
  @IsOptional()
  deposit_amount: string;

  @ApiProperty()
  @IsOptional()
  deposit_currency: string;

  @ApiProperty()
  @IsOptional()
  deposit_status: string;

  @ApiProperty()
  @IsOptional()
  deposit_required_at: string;

  @ApiProperty()
  @IsOptional()
  short_reference: string;

  @ApiProperty()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsOptional()
  amount: string;

  @ApiProperty()
  @IsOptional()
  currency: string;

  @ApiProperty()
  @IsOptional()
  beneficiary_id: string;

  @ApiProperty()
  @IsOptional()
  payment_type: string;

  @ApiProperty()
  @IsOptional()
  reference: string;

  @ApiProperty()
  @IsOptional()
  reason: string;

  @ApiProperty()
  @IsOptional()
  payment_date: string;

  @ApiProperty()
  @IsOptional()
  estimated_arrival: string;

  @ApiProperty()
  @IsOptional()
  purpose_code: string;

  @ApiProperty()
  @IsOptional()
  transferred_at: string;

  @ApiProperty()
  @IsOptional()
  fee_amount: string;

  @ApiProperty()
  @IsOptional()
  fee_currency: string;

  @ApiProperty()
  @IsOptional()
  settles_at: string;

  @ApiProperty()
  @IsOptional()
  completed_at: string;

  @ApiProperty()
  @IsOptional()
  additional_information: string;

  @ApiProperty()
  @IsOptional()
  sender: string;
}

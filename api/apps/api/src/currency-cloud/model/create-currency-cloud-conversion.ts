export interface CreateCurrencyCloudConversionDto {
  buy_currency: string;
  sell_currency: string;
  fixed_side: string;
  amount: string;
  term_agreement: boolean;
  conversion_date?: string;
}

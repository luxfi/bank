export type TState = {
  isLoading: boolean;
};

export type TActions = {
  setConversionPreview(
    data: IConversionPayload
  ): Promise<IConversionPreviewResponse>;
  setConversion(data: IConversionPayload): Promise<IConversionResponse>;
};

export interface IConversionPayload {
  amount: number;
  sellCurrency: string;
  buyCurrency: string;
  date: string;
  quoteId?: string;
  direction: string;
}

export interface IConversionPreviewResponse {
  rate: string;
  amount: string;
  sellCurrency: string;
  buyCurrency: string;
  direction: string;
  expiresDate: string;
  quoteId?: string;
  first_conversion_cutoff_datetime: string;
  first_conversion_date: string;
  next_day_conversion_date: string;
  default_conversion_date: string;
  optimize_liquidity_conversion_date: string;
  invalid_conversion_dates?: Array<string>;
}

export interface IConversionResponse {
  id: string;
}

export const PATHS = {
  CONVERSION_PREVIEW: '/api/v2/conversions/preview',
  CONVERSION_CREATE: '/api/v2/conversions',
};

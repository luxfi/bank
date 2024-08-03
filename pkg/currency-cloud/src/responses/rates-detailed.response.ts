export interface RatesDetailedResponse {
    settlement_cut_off_time: string;
    currency_pair: string;
    client_buy_currency: string;
    client_sell_currency: string;
    client_buy_amount: string;
    client_sell_amount: string;
    fixed_side: string;
    client_rate: string;
    partner_rate?: string;
    core_rate: string;
    deposit_required: boolean;
    deposit_amount: string;
    deposit_currency: string;
    mid_market_rate: string;
}
  
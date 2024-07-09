import {
  GetLoggedUserUseCase,
  GetWalletBalancesUseCase,
  GetWalletbalancesCCUseCase,
  GetWalletbalancesIFXUseCase,
  GetWalletCurrenciesUseCase,
  GetWalletCurrenciesCCUseCase,
  GetWalletCurrenciesIFXUseCase,
} from '@domain/use-cases';
import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForUser } from '@tools/models';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { WalletsController } from './wallets.controller';
import {
  GetWalletDetailCCUseCase,
  GetWalletDetailIFXUseCase,
  GetWalletDetailUseCase,
} from '@domain/use-cases/get-wallet-detail';

import {
  GetWalletBalanceDetailCCUseCase,
  GetWalletBalanceDetailIFXUseCase,
  GetWalletBalanceDetailUseCase,
} from '@domain/use-cases/get-wallet-balance-detail';

@Module({
  imports: [MikroOrmRegisteredForUser()],
  controllers: [WalletsController],
  providers: [
    paymentAdapter(GetWalletBalancesUseCase, {
      factory: {
        currencyCloud: GetWalletbalancesCCUseCase,
        ifx: GetWalletbalancesIFXUseCase,
      },
    }),
    paymentAdapter(GetWalletDetailUseCase, {
      factory: {
        currencyCloud: GetWalletDetailCCUseCase,
        ifx: GetWalletDetailIFXUseCase,
      },
    }),
    paymentAdapter(GetWalletBalanceDetailUseCase, {
      factory: {
        currencyCloud: GetWalletBalanceDetailCCUseCase,
        ifx: GetWalletBalanceDetailIFXUseCase,
      },
    }),
    paymentAdapter(GetWalletCurrenciesUseCase, {
      factory: {
        currencyCloud: GetWalletCurrenciesCCUseCase,
        ifx: GetWalletCurrenciesIFXUseCase,
      },
    }),
    GetLoggedUserUseCase,
  ],
})
export class WalletsModule {}

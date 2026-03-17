import { GetLoggedUserUseCase, GetWalletBalancesUseCase, GetWalletbalancesCCUseCase, GetWalletbalancesIFXUseCase, GetWalletCurrenciesUseCase,
        GetWalletCurrenciesCCUseCase, GetWalletCurrenciesIFXUseCase, GetWalletDetailCCUseCase, GetWalletDetailIFXUseCase, GetWalletDetailUseCase,
        GetWalletBalanceDetailCCUseCase, GetWalletBalanceDetailIFXUseCase, GetWalletBalanceDetailUseCase } from '../../use-cases';
import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForUser } from '@luxbank/tools-models';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { WalletsController } from './wallets.controller';
import { CryptoWalletsController } from './crypto-wallets.controller';
import { TradingModule } from '../../trading/trading.module';

@Module({
    imports: [
        MikroOrmRegisteredForUser(),
        TradingModule,
    ],
    controllers: [WalletsController, CryptoWalletsController],
    providers: [
        paymentAdapter(GetWalletBalancesUseCase, {
            factory: {
                currencyCloud: GetWalletbalancesCCUseCase,
                ifx: GetWalletbalancesIFXUseCase
            }
        }),
        paymentAdapter(GetWalletDetailUseCase, {
            factory: {
                currencyCloud: GetWalletDetailCCUseCase,
                ifx: GetWalletDetailIFXUseCase
            }
        }),
        paymentAdapter(GetWalletBalanceDetailUseCase, {
            factory: {
                currencyCloud: GetWalletBalanceDetailCCUseCase,
                ifx: GetWalletBalanceDetailIFXUseCase
            }
        }),
        paymentAdapter(GetWalletCurrenciesUseCase, {
            factory: {
                currencyCloud: GetWalletCurrenciesCCUseCase,
                ifx: GetWalletCurrenciesIFXUseCase
            }
        }),
        GetLoggedUserUseCase
    ]
})
export class WalletsModule { }

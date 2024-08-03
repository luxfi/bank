import { GetLoggedUserUseCase, GetWalletBalancesUseCase, GetWalletbalancesCCUseCase, GetWalletbalancesIFXUseCase, GetWalletCurrenciesUseCase,
        GetWalletCurrenciesCCUseCase, GetWalletCurrenciesIFXUseCase, GetWalletDetailCCUseCase, GetWalletDetailIFXUseCase, GetWalletDetailUseCase,
        GetWalletBalanceDetailCCUseCase, GetWalletBalanceDetailIFXUseCase, GetWalletBalanceDetailUseCase } from '../../use-cases';
import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForUser } from '@luxbank/tools-models';
import { paymentAdapter } from '../shared/providers/payment-adapter.provider';
import { WalletsController } from './wallets.controller';

@Module({
    imports: [MikroOrmRegisteredForUser()],
    controllers: [WalletsController],
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

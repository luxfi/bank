import { Injectable, Logger } from '@nestjs/common';
import { Account, Fee, FeesRepository, User } from '@cdaxfx/tools-models';
import { feesTable } from '../openpayd/feesTable';

@Injectable()
export class FeesService {
    private logger: Logger = new Logger(FeesService.name);

    constructor(
        private readonly feesRepository: FeesRepository
    ) { }

    async create(data: any, user?: User | undefined): Promise<Fee | null> {
        const fee = await this.feesRepository.createFee(data, user);
        this.feesRepository.getEntityManager().persistAndFlush(fee);
        return fee;
    }

    async getFeesByAccount(account: Account): Promise<Fee | null> {
        const fee = await this.feesRepository.findOne({account});
        return fee;
    }

    async getRawFeeAmount(amount, accountId, type, currency, payment_type = '') {
        let fee = {
            amount: 0,
            type: 'fixed',
            currency: 'USD'
        };
        const dbFee = await this.feesRepository.findOne({accountId});
        if (dbFee) {
            const feeType = type == 'conversion' ? type : payment_type;
            if (dbFee[`${feeType}_amount`] >= 0) {
                fee.amount = Number(dbFee[`${feeType}_amount`]);
                fee.currency = dbFee[`${feeType}_currency`];
                fee.type = type == 'conversion' ? 'percentage' : 'fixed';
            }
        } 
        else if (feesTable['default'][type]['default']) {
            fee = feesTable['default'][type]['default'];
        }
        return fee;
    }

    async getFee(amount, accountId, type, currency, payment_type = '') {
        const fee = await this.getRawFeeAmount(
            amount,
            accountId,
            type == 'payment' ? 'payment' : 'conversion',
            currency,
            payment_type
        );
        const fee_amount = Number(fee.amount);
        
        if (!fee || !fee.amount)
            return 0;
        
        if (fee.type == 'percentage') {
            if (type == 'completed_conversion')
                return Number(Number(amount - (amount / (100 + fee_amount)) * 100).toFixed(2));
            else
                return Number(Number((fee_amount * amount) / 100).toFixed(2));
        } 
        else {
            if (fee.currency != currency) {
                // const conversionRate = await this.openPaydService.getBasicRate(
                //   fee.currency,
                //   currency,
                // );
                // const rate = conversionRate.rates[0].ask;
                // fee_amount = rate * fee_amount;
            }
            return Number(fee_amount);
        }
    }
}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { generateShortUniqId } from '@cdaxfx/tools-misc';
import { ClientsRepository, Transaction, TransactionAction, TransactionStatusApproval, TransactionsRepository } from '@cdaxfx/tools-models';

export enum TransactionType {
    Test = 'test_notification',
    Credit = 'ibanq_credit'
}

export interface HookTypeI {
    id: string;
    type: string;
    timestamp: string;
    message: {
        currency: string;
        amount: number;
        reference: string;
        account: {
            id: string;
            accountNumber: string;
            sortCode: string;
            name: string;
        };
        sender: {
            accountNumber: string;
            sortCode: string;
            iban: string;
            name: string;
        };
    };
}

@Injectable()
export class WebhooksIfxService {
    logger = new Logger(WebhooksIfxService.name);
    constructor(
        private readonly transactionsRepository: TransactionsRepository,
        private readonly clientsRepository: ClientsRepository
    ) { }

    async updateTransaction(data: HookTypeI) {
        let trx = await this.transactionsRepository.findOne({
            transaction_id: data.id
        });

        if (!trx) {
            const client = await this.clientsRepository.findOne(
                {
                    account: {
                        bankMetadata: {
                            IBAN: data.message.sender.iban,
                            accountNumber: data.message.sender.accountNumber,
                            sortCode: data.message.sender.sortCode
                        }
                    }
                },
                { populate: ['account', 'account.bankMetadata'] }
            );

            if (!client)
                throw new NotFoundException('Client not found');
            
            trx = new Transaction();
            trx.transaction_id = data.id;
            trx.short_id = data.id;
            trx.gateway = 'ifx';
            trx.action = TransactionAction.Payment;
            trx.client_uuid = client.uuid;
            trx.creator_uuid = `${process.env.BACKOFFICE_UUID}`;
            trx.account_id = client.account?.uuid ?? '';
            trx.amount = `${data.message.amount}`;
            trx.currency = data.message.currency;
            trx.reference = data.message.reference;
            trx.status = 'pending';
            trx.payment_type = 'bank_transfer';
            trx.payment_date = data.timestamp;
            trx.status_approval = TransactionStatusApproval.Done;
            trx.gateway_id = data.id;
            trx.cdax_id = generateShortUniqId(8);
        } else {
            trx.status = 'completed';
            trx.settlement_date = data.timestamp;
            trx.gateway_completed_at = data.timestamp;
        }

        await this.transactionsRepository.getEntityManager().persistAndFlush(trx);
    }
}

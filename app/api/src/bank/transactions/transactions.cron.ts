import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PaymentProviderIFX } from '@luxbank/ports-ifx';
import { TransactionStatus, TransactionStatusMap, TransactionsRepository, UsersRepository } from '@luxbank/tools-models';
import dayjs from 'dayjs';

@Injectable()
export class TransactionsCron {
    private logger: Logger = new Logger(TransactionsCron.name);
    constructor(
        private readonly transactionsRepository: TransactionsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly entityManager: EntityManager
    ) { }

    @Cron('0 */5 * * * *') // Executa a cada 5 minutos
    async handleCron() {
        this.logger.log(':: Running transactions cron ::');

        const pendingTransactions = await this.transactionsRepository.find({
            status: { $in: TransactionStatusMap['pending'] },
            gateway: 'ifx'
        });

        this.logger.log(
            `:: Found ${pendingTransactions.length} pending transactions ::`
        );

        if (pendingTransactions.length === 0) {
            return;
        }

        for (const transaction of pendingTransactions) {
            try {
                const creator = await this.usersRepository.findOne(
                    {
                        uuid: transaction.creator_uuid
                    },
                    {
                        populate: [
                            'clients',
                            'clients.account',
                            'clients.account.individualMetadata',
                            'clients.account.businessMetadata'
                        ]
                    }
                );

                if (!creator) {
                    this.logger.error(`:: Creator not found: ${transaction.creator_uuid} ::`);
                    continue;
                }

                creator.setCurrentClient(transaction.client_uuid);

                const ifx = new PaymentProviderIFX(creator);

                if (transaction.action === 'payment') {
                    const response = await ifx.getPaymentDetail(transaction.transaction_id);

                    this.logger.log(`:: Payment: ${transaction.uuid} ::`, response.status);

                    if (response.status === 'approved' || response.status === 'confirmed') {
                        transaction.status = TransactionStatus.Completed;
                        transaction.settlement_date = dayjs(response.arriveBy).format('YYYY-MM-DD');
                        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);

                        this.logger.log(`:: Processed Payment: ${transaction.uuid} ::`, response.status);
                    }
                }

                if (transaction.action === 'conversion') {
                    const response = await ifx.getConversionDetail(transaction.transaction_id);

                    this.logger.log(`:: Conversion: ${transaction.uuid} ::`, response.dueDate);

                    if (dayjs(response.dueDate).isBefore(dayjs())) {
                        transaction.status = TransactionStatus.Completed;
                        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
                        this.logger.log(`:: Processed Conversion: ${transaction.uuid} ::`, response.dueDate);
                    }
                }
            } catch (error) {
                this.logger.error(`:: Error processing ${transaction.uuid}:`, (error as Error).message);
            }
        }
    }
}

import { PaymentProviderCurrencyCloud } from '@cdaxfx/ports-currency-cloud';
import { Transaction, TransactionStatusApproval, TransactionsRepository, User, TransactionStatus } from '@cdaxfx/tools-models';
import { Request } from 'express';
import { ApprovePaymentUseCase } from './abstract.handler';
import { ApprovePaymentRequest } from './types/approve-payment.request.type';
import { ApprovePaymentResponse } from './types/approve-payment.response.type';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import ApprovePaymentEmail from '../../currency-cloud/emails/approve-payment';
import { MailerService } from '@cdaxfx/ports-email';
import dayjs from 'dayjs';

export class ApprovePaymentCCUseCase extends ApprovePaymentUseCase {
    constructor(
        protected paymentProvider: PaymentProviderCurrencyCloud,
        private request: Request,
        private readonly transactionsRepository: TransactionsRepository,
        private readonly mailer: MailerService
    ) {
        super();
    }

    async handle(body: ApprovePaymentRequest, user: User): Promise<ApprovePaymentResponse> {
        const { id } = body;
        const accountId =
            user.getCurrentClient()?.account?.gatewayId ??
            user.getCurrentClient()?.account?.cloudCurrencyId;

        if (!accountId)
            throw new NotFoundException({messages: ['Account not found']});

        const payment = await this.findByUuidAndAccountId(id, accountId);

        if (!payment)
            throw new NotFoundException({messages: ['Payment not found']});

        const result = await this.paymentProvider.createPayment(
            {
                account_id: accountId,
                currency: payment.currency,
                purpose_code: payment.purpose_code,
                beneficiary_id: payment.beneficiary_id,
                amount: payment.amount,
                reason: payment.reason,
                reference: payment.reference,
                payment_type: payment.payment_type,
                payment_date: payment.payment_date,
            },
            user,
            payment.uuid
        );

        if (!result)
            throw new BadRequestException({messages: ['Payment could not be created on currency cloud']});

        await this.updateStatusApprovalTransaction(
            id,
            TransactionStatusApproval.Done,
            'Payment approved',
            result.uuid,
            user.uuid
        );

        await this.notifyUserApprovedPayment(
            payment.creator.username,
            user.firstname,
            payment.reference
        );

        return {
            id: payment.uuid,
            ...result
        };
    }

    async notifyUserApprovedPayment(to: string, name: string, reference: string) {
        const emails = [to, `${process.env.BACKOFFICE_EMAIL}`];
        const emailsPromises = emails.map((sendTo) =>
            this.mailer.send(
                new ApprovePaymentEmail({
                    to: sendTo,
                    name,
                    reference,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm'),
                })
            )
        );

        return Promise.all(emailsPromises);
    }

    async updateStatusApprovalTransaction(
        uuid: string,
        status_approval: TransactionStatusApproval,
        description: string,
        transaction_id: string | null = null,
        approver_uuid: string
    ) {
        const transaction = await this.transactionsRepository.findOne(uuid);

        if (!transaction)
            throw new NotFoundException({messages: ['Transaction not found']});

        transaction.status_approval = status_approval;
        transaction.description = description;
        transaction.updatedAt = new Date();
        transaction.approver_uuid = approver_uuid;
        transaction.status = TransactionStatus.ReadyToSend;

        if (transaction_id)
            transaction.transaction_id = transaction_id;

        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    async findByUuidAndAccountId(uuid: string, account_id: string): Promise<Transaction | null> {
        return this.transactionsRepository.findOne(
            {
                uuid: uuid,
                account_id
            },
            {
                populate: ['creator']
            }
        );
    }
}

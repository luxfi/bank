import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@cdaxfx/ports-email';
import RejectPaymentEmail from '../../currency-cloud/emails/reject-payment';
import { Transaction, TransactionStatusApproval, TransactionsRepository, User } from '@cdaxfx/tools-models';
import * as dayjs from 'dayjs';
import { RejectPaymentRequest } from './types/reject-payment.request.type';
import { RejectPaymentResponse } from './types/reject-payment.response.type';

@Injectable()
export class RejectPaymentDomainUseCase {
    constructor(
        private readonly transactionsRepository: TransactionsRepository,
        private readonly mailer: MailerService
    ) { }

    async handle(body: RejectPaymentRequest, user: User): Promise<RejectPaymentResponse> {
        const { id, description } = body;
        const accountId = user.getCurrentClient()?.account?.gatewayId;

        if (!accountId)
            throw new NotFoundException({messages: ['Account not found']});

        const payment = await this.findByUuidAndAccountId(id, accountId);

        if (!payment)
            throw new NotFoundException({messages: ['Payment not found']});

        if (payment.status_approval !== TransactionStatusApproval.Pending)
            throw new BadRequestException({messages: ['Payment already approved or rejected']});

        await this.updateStatusApprovalTransaction(
            id,
            TransactionStatusApproval.Rejected,
            description,
            null,
            user.uuid
        );

        await this.notifyUserRejectedPayment(
            payment.creator.username,
            user.firstname,
            user.username,
            payment.reference,
            payment.description
        );

        return { statusApproval: TransactionStatusApproval.Rejected };
    }

    async notifyUserRejectedPayment(
        to: string,
        name: string,
        email,
        reference: string,
        description: string
    ) {
        const emails = [to, `${process.env.BACKOFFICE_EMAIL}`];

        const emailsPromises = emails.map((sendTo) =>
            this.mailer.send(
                new RejectPaymentEmail({
                    to: sendTo,
                    name,
                    email,
                    reference,
                    description,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm')
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

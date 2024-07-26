import { PaymentProviderIFX } from '@cdaxfx/ports-ifx';
import { CreatePaymentUseCase } from './abstract.handler';
import { BeneficiariesRepository, MemberRoles, Transaction, TransactionsRepository, TransactionStatus, TransactionStatusApproval, User, UsersRepository } from '@cdaxfx/tools-models';
import { CreatePaymentsRequest } from './types/payments.request.type';
import { CreatePaymentsResponse } from './types/payments.response.type';
import { MailerService } from '@cdaxfx/ports-email';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import PendingPaymentEmail from '../../currency-cloud/emails/pending-payment';
import dayjs from 'dayjs';

export class CreatePaymentIFXUseCase extends CreatePaymentUseCase {
    constructor(
        protected paymentProvider: PaymentProviderIFX,
        private request: Request,
        private readonly transactionsRepository: TransactionsRepository,
        private readonly beneficiariesRepository: BeneficiariesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly mailer: MailerService
    ) {
        super();
    }

    async handle(createPaymentDto: CreatePaymentsRequest, user: User): Promise<CreatePaymentsResponse> {
        const status_approval = MemberRoles.includes(user.role)
            ? TransactionStatusApproval.Pending
            : TransactionStatusApproval.Done;

        const beneficiary = await this.beneficiariesRepository.findOne({
            uuid: createPaymentDto.beneficiaryId
        });

        if (!beneficiary || !beneficiary.gatewayId)
            throw new BadRequestException({messages: ['Beneficiary not found']});

        const paymentTransaction = await this.createTransaction(
            {
                status: 'init',
                action: 'payment',
                gateway: 'ifx',
                gateway_id: user.getCurrentClient()?.account?.gatewayId,
                account_id: user.getCurrentClient()?.account?.gatewayId,
                client_uuid: user.getCurrentClient()?.uuid,
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency,
                beneficiary_id: createPaymentDto.beneficiaryId,
                reference: createPaymentDto.reference,
                reason: createPaymentDto.reason,
                cdax_beneficiary_id: beneficiary?.uuid,
                payment_type: createPaymentDto.type,
                payment_date: createPaymentDto.date,
                status_approval,
                short_id: '',
                impersonator_uuid: user.personatedBy
            },
            user
        );

        if (!paymentTransaction) 
            throw new BadRequestException({messages: ['Transaction could not be created']});

        const accounts = await this.paymentProvider.detailAccountBeneficiary(beneficiary.gatewayId);

        if (!accounts[0]?.id)
            throw new BadRequestException({messages: ['Beneficiary bank account was not found']});

        if (status_approval === TransactionStatusApproval.Done) {
            const result = await this.paymentProvider.createPayment({
                beneficiaryAccountId: accounts[0].id,
                amount: createPaymentDto.amount,
                currency: createPaymentDto.currency,
                reference: createPaymentDto.reference,
                arriveBy: createPaymentDto.date
            });

            await this.updateTransactionId(
                paymentTransaction.uuid,
                result.id,
                createPaymentDto.reference
            );
        } else {
            await this.notifyManagersToApprovePayment(
                paymentTransaction.account_id,
                paymentTransaction.uuid,
                user
            );
        }

        return { id: paymentTransaction.uuid };
    }

    async notifyManagersToApprovePayment(
        accountId: string,
        transactionId: string,
        creator: User
    ) {
        const users = await this.usersRepository.getManagerUsersByAccountId(accountId);

        const emailsPromises = users.map((user) =>
            this.mailer.send(
                new PendingPaymentEmail({
                    to: user.username,
                    uuid: transactionId,
                    fullName: creator.getFullName(),
                    email: creator.username,
                    phone: creator.contact?.mobileNumber,
                    createdAt: dayjs().format('DD/MM/YYYY HH:mm')
                })
            )
        );

        return Promise.all(emailsPromises);
    }

    private async createTransaction(data: any, user: User): Promise<Transaction | null> {
        const transaction = await this.transactionsRepository.createTransaction(data, user);
        this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    private async updateTransactionId(uuid: string, transaction_id: string, short_id: string) {
        const transaction = await this.transactionsRepository.findOne(uuid);
        if (!transaction)
            throw new NotFoundException({messages: ['Transaction not found']});

        transaction.transaction_id = transaction_id;
        transaction.short_id = short_id;
        transaction.status = TransactionStatus.ReadyToSend;

        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }
}

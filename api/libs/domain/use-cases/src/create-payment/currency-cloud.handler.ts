import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { MailerService } from '@ports/email';
import PendingPaymentEmail from '@ports/email/emails/pending-payment';
import {
  BeneficiariesRepository,
  MemberRoles,
  Transaction,
  TransactionStatusApproval,
  TransactionsRepository,
  User,
  UsersRepository,
  TransactionStatus,
} from '@tools/models';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { CreatePaymentUseCase } from './abstract.handler';
import { CreatePaymentsRequest } from './types/payments.request.type';
import { CreatePaymentsResponse } from './types/payments.response.type';

export class CreatePaymentCCUseCase extends CreatePaymentUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderCurrencyCloud,
    private request: Request,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly beneficiaryRepository: BeneficiariesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly mailer: MailerService,
  ) {
    super();
  }

  gateway = 'currencycloud';

  async handle(
    createPaymentDto: CreatePaymentsRequest,
    user: User,
  ): Promise<CreatePaymentsResponse> {
    const status_approval = MemberRoles.includes(user.role)
      ? TransactionStatusApproval.Pending
      : TransactionStatusApproval.Done;

    const beneficiary = await this.beneficiaryRepository.findOne({
      uuid: createPaymentDto.beneficiaryId,
    });

    if (!beneficiary) {
      throw new BadRequestException({
        messages: ['Beneficiary not found'],
      });
    }
    const paymentTransaction = await this.create(
      {
        status: 'init',
        action: 'payment',
        gateway: this.gateway,
        account_id: user.getCurrentClient()?.account?.gatewayId,
        client_uuid: user.getCurrentClient()?.uuid,
        gateway_id: user.getCurrentClient()?.account?.gatewayId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        beneficiary_id: beneficiary?.gatewayId,
        cdax_beneficiary_id: createPaymentDto.beneficiaryId,
        reference: createPaymentDto.reference,
        reason: createPaymentDto.reason,
        payment_type: createPaymentDto.type,
        payment_date: createPaymentDto.date,
        status_approval,
        short_id: '',
        impersonator_uuid: user.personatedBy,
      },
      user,
    );

    if (!paymentTransaction) {
      throw new BadRequestException({
        messages: ['Transaction could not be created'],
      });
    }

    if (status_approval === TransactionStatusApproval.Done) {
      const result = await this.paymentProvider.createPayment(
        {
          currency: createPaymentDto.currency,
          beneficiary_id: beneficiary?.gatewayId,
          amount: createPaymentDto.amount,
          reason: createPaymentDto.reason,
          reference: createPaymentDto.reference,
          payment_type: createPaymentDto.type,
          payment_date: createPaymentDto.date,
          account_id:
            createPaymentDto.accountId ??
            user.getCurrentClient()?.account?.gatewayId,
          purpose_code: createPaymentDto.purposeCode,
        },
        user,
        paymentTransaction.uuid,
      );

      if (!result) {
        throw new BadRequestException({
          messages: ['Payment could not be created on currencycloud'],
        });
      }

      await this.updateTransactionId(
        paymentTransaction.uuid,
        result.id,
        createPaymentDto.reference,
      );
    } else {
      await this.notifyManagersToApprovePayment(
        paymentTransaction.account_id,
        paymentTransaction.uuid,
        user,
      );

      console.log(
        'Payment created with status approval pending',
        paymentTransaction,
      );
    }

    return { id: paymentTransaction.uuid };
  }

  private async updateTransactionId(
    uuid: string,
    transaction_id: string,
    short_id: string,
  ) {
    const transaction = await this.transactionsRepository.findOne(uuid);

    if (!transaction) {
      throw new NotFoundException({
        messages: ['Transaction not found'],
      });
    }

    transaction.transaction_id = transaction_id;
    transaction.short_id = short_id;
    transaction.status = TransactionStatus.ReadyToSend;

    await this.transactionsRepository.persistAndFlush(transaction);
    return transaction;
  }

  private async create(data: any, user: User): Promise<Transaction | null> {
    const transaction = await this.transactionsRepository.createTransaction(
      data,
      user,
    );
    this.transactionsRepository.persistAndFlush(transaction);
    return transaction;
  }

  async notifyManagersToApprovePayment(
    accountId: string,
    transactionId: string,
    creator: User,
  ) {
    const users = await this.usersRepository.getManagerUsersByAccountId(
      accountId,
    );

    const emailsPromises = users.map((user) =>
      this.mailer.send(
        new PendingPaymentEmail({
          to: user.username,
          uuid: transactionId,
          fullName: creator.getFullName(),
          email: creator.username,
          phone: creator.contact?.mobileNumber,
          createdAt: dayjs().format('DD/MM/YYYY HH:mm'),
        }),
      ),
    );

    return Promise.all(emailsPromises);
  }
}

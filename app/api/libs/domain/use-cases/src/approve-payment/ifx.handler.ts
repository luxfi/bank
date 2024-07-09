import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailerService } from '@ports/email';
import ApprovePaymentEmail from '@ports/email/emails/approve-payment';
import { PaymentProviderIFX } from '@ports/ifx';
import { ECountryCode, ECurrencyCode } from '@tools/misc';
import {
  Transaction,
  TransactionsRepository,
  TransactionStatus,
  TransactionStatusApproval,
  User,
} from '@tools/models';
import { ApprovePaymentUseCase } from './abstract.handler';
import { ApprovePaymentRequest } from './types/approve-payment.request.type';
import { ApprovePaymentResponse } from './types/approve-payment.response.type';
import * as dayjs from 'dayjs';

export class ApprovePaymentIFXUseCase extends ApprovePaymentUseCase {
  /**
   * any other injections in order, after paymentProvider and request
   */
  constructor(
    protected paymentProvider: PaymentProviderIFX,
    private request: Request,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly mailer: MailerService,
  ) {
    super();
  }

  async handle(
    body: ApprovePaymentRequest,
    user: User,
  ): Promise<ApprovePaymentResponse> {
    const { id } = body;
    const accountId =
      user.getCurrentClient()?.account?.gatewayId ??
      user.getCurrentClient()?.account?.cloudCurrencyId;

    if (!accountId) {
      throw new NotFoundException({
        messages: ['Account not found'],
      });
    }

    const payment = await this.findByUuidAndAccountId(id, accountId);

    if (!payment) {
      throw new NotFoundException({
        messages: ['Payment not found'],
      });
    }

    if (!payment.beneficiary.gatewayId) {
      throw new BadRequestException({
        messages: ['Beneficiary not found on gateway.'],
      });
    }

    const accounts = await this.paymentProvider.detailAccountBeneficiary(
      payment.beneficiary.gatewayId,
    );

    if (!accounts[0]?.id) {
      throw new BadRequestException({
        messages: ['Beneficiary bank account was not found'],
      });
    }

    const result = await this.paymentProvider.createPayment({
      beneficiaryAccountId: accounts[0].id,
      amount: Number(payment.amount),
      currency: payment.currency,
      reference: payment.reference,
      arriveBy: payment.payment_date,
    });

    await this.updateStatusApprovalTransaction(
      id,
      TransactionStatusApproval.Done,
      'Payment approved',
      result.id,
      user.uuid,
    );

    await this.notifyUserApprovedPayment(
      payment.creator.username,
      user.firstname,
      payment.reference,
    );

    return {
      id,
      name: payment.beneficiary.getName(),
      bankCountry: payment.beneficiary.bankCountry as ECountryCode,
      currency: payment.currency as ECurrencyCode,
      status: TransactionStatusApproval.Done,
      gatewayId: payment.gateway,
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
        }),
      ),
    );

    return Promise.all(emailsPromises);
  }

  async updateStatusApprovalTransaction(
    uuid: string,
    status_approval: TransactionStatusApproval,
    description: string,
    transaction_id: string | null = null,
    approver_uuid: string,
  ) {
    const transaction = await this.transactionsRepository.findOne(uuid);

    if (!transaction) {
      throw new NotFoundException({
        messages: ['Transaction not found'],
      });
    }

    transaction.status_approval = status_approval;
    transaction.description = description;
    transaction.updatedAt = new Date();
    transaction.approver_uuid = approver_uuid;
    transaction.status = TransactionStatus.ReadyToSend;

    if (transaction_id) {
      transaction.transaction_id = transaction_id;
    }

    await this.transactionsRepository.persistAndFlush(transaction);
    return transaction;
  }

  async findByUuidAndAccountId(
    uuid: string,
    account_id: string,
  ): Promise<Transaction | null> {
    return this.transactionsRepository.findOne(
      {
        uuid: uuid,
        account_id,
      },
      {
        populate: ['creator', 'beneficiary'],
      },
    );
  }
}

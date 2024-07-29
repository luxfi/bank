import { Body, Controller,  Get, NotFoundException, Param, Post, Query, Request, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Holidays from 'date-holidays';
import { Anonymous } from '../auth/anonymous.decorator';
import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../model/Pagination.dto';
import { SuccessResponse } from '@cdaxfx/tools-misc';
import { CurrencyCloudService } from './currency-cloud.service';
import { CreateCurrencyBeneficiary, CreateCurrencyQuote, CreateCurrencyTopUp, CreateValidatePayment, DateChangeDTO, DeletePaymentDTO, DeliveryDateDTO, SplitConversionDTO } from './model/create-currency-quote.dto';
import { UserRole, ManagerRoles, UserRoles, MemberRoles, TransactionStatusApproval, TransactionStatusLabel, TransactionStatus } from '@cdaxfx/tools-models';
import { TransactionsService } from '../transactions/services/transactions.service';
import { convertData } from './model/transaction-dto.transformer';
import { TransactionDescriptionDto } from './model/currency-cloud-transaction.dto';
import * as dayjs from 'dayjs';

@ApiTags('CurrencyCloud')
@ApiBearerAuth()
@Controller('currencycloud')
export class CurrencyCloudController {
    constructor(
        private readonly currencyCloudService: CurrencyCloudService,
        private readonly transactionsService: TransactionsService,
    ) { }

    @Post('webhook')
    @Anonymous()
    @UsePipes(new ValidationPipe({ transform: true }))
    async webhook(@Body() webhook_data: any) {
        console.error(webhook_data);
        return new SuccessResponse({ success: true });
    }

    @Get('balances')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async balances(@Request() req) {
        const data = await this.currencyCloudService.getBalances(req.user);
        return new SuccessResponse(data);
    }

    @Get('currencies')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async currencies(@Request() req) {
        const data = await this.currencyCloudService.getCurrencies(req.user);
        return new SuccessResponse(data);
    }

    @Get('beneficiaries/:currency')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async beneficiaries(@Param('currency') currency: string, @Request() req) {
        const data = await this.currencyCloudService.getBeneficiaries(currency, req.user);
        return new SuccessResponse(data);
    }

    @Post('payers')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    @UsePipes(new ValidationPipe({ transform: true }))
    async payers(@Body() uuid: DeletePaymentDTO, @Request() req) {
        const data = await this.currencyCloudService.getPayer(uuid.uuid, req.user);
        return new SuccessResponse(data);
    }

    @Get('transaction/:currency/:settles_at_from/:completed_at_from/:page')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async transaction(
        @Param('currency') currency: string,
        @Param('settles_at_from') settles_at_from: string,
        @Param('completed_at_from') completed_at_from: string,
        @Param('page') page: number,
        @Request() req,
        @Query(new ValidationPipe({ transform: true })) query: PaginationDto
    ) {
        const data = await this.currencyCloudService.getTransaction(
            currency,
            settles_at_from,
            completed_at_from,
            page,
            req.user
        );
        return new SuccessResponse(data);
    }

    @Get('transactionref/:short_ref')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async transactionref(@Param('short_ref') short_ref: string, @Request() req) {
        const data = await this.currencyCloudService.getTransactionRef(short_ref, req.user);
        return new SuccessResponse(data);
    }

    @Get('conversion/:uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async conversion(@Param('uuid') uuid: string, @Request() req) {
        const data = await this.currencyCloudService.getConversion(uuid, req.user);
        return new SuccessResponse({...data, status: TransactionStatusLabel[data.status]});
    }

    @Post('conversion/:uuid/edit')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async dateChange(@Param('uuid') uuid: string, @Request() req, @Body() { new_settlement_date }: DateChangeDTO) {
        const data = await this.currencyCloudService.dateChange(uuid, new_settlement_date, req.user);
        return new SuccessResponse(data);
    }

    @Post('conversion/:uuid/split_preview')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async splitPreview(@Param('uuid') uuid: string, @Request() req, @Body() { amount }: SplitConversionDTO) {
        const data = await this.currencyCloudService.splitPreview(uuid, amount, req.user);
        return new SuccessResponse(data);
    }

    @Post('conversion/:uuid/split')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async split(@Param('uuid') uuid: string, @Request() req, @Body() { amount }: SplitConversionDTO) {
        const data = await this.currencyCloudService.split(uuid, amount, req.user);
        return new SuccessResponse(data);
    }

    @Get('payment/:uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async payment(@Param('uuid') uuid: string, @Request() req) {
        const data = await this.currencyCloudService.getPayment(uuid, req.user);
        const payment = await this.transactionsService.findByTransactionId(uuid, 'currencycloud');

        if (!payment || !data)
            throw new NotFoundException('Payment not found');

        return new SuccessResponse({
            ...data,
            status: dayjs(dayjs(payment.payment_date).format('YYYY-MM-DD')).isAfter(dayjs())
                ? TransactionStatus.Scheduled
                : TransactionStatusLabel[payment.status],
            status_approval: payment.status_approval,
            rejection_reason: payment.description,
            approver: payment.approver?.getFullName() ?? ''
        });
    }

    @Get('beneficiary/:uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async beneficiary(@Param('uuid') uuid: string, @Request() req) {
        const data = await this.currencyCloudService.getBeneficiary(uuid, req.user);
        return new SuccessResponse(data);
    }

    @Get('bank_beneficiary/:uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async bank_beneficiary(@Param('uuid') uuid: string, @Request() req) {
        const data = await this.currencyCloudService.getBeneficiary(uuid, req.user);
        return new SuccessResponse(data);
    }

    @Get('currencyaccount/:currency')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async currencyaccount(@Param('currency') currency: string, @Request() req) {
        const data = await this.currencyCloudService.createCurrencyAcccount(currency, req.user);
        return new SuccessResponse(data);
    }

    @Get('accounts')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async accounts(@Request() req, @Query(new ValidationPipe({ transform: true })) query: PaginationDto) {
        const data = await this.currencyCloudService.getAccounts(req.user);
        return new SuccessResponse(data);
    }

    @Get('current')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async current(@Request() req) {
        const data = await this.currencyCloudService.getCurrentAccount(req.user);
        return new SuccessResponse(data);
    }

    @Get('account/:account_id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async account(@Param('account_id') account_id: string, @Request() req) {
        const data = await this.currencyCloudService.getAccount(account_id, req.user);
        return new SuccessResponse(data);
    }

    @Get('sender/:entity_id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async sender(@Param('entity_id') entity_id: string, @Request() req) {
        const data = await this.currencyCloudService.getSender(entity_id, req.user);
        return new SuccessResponse(data);
    }

    @Get('contacts/:account_id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async contacts(@Param('account_id') account_id: string, @Request() req, @Query(new ValidationPipe({ transform: true })) query: PaginationDto) {
        const data = await this.currencyCloudService.getContacts(account_id, req.user);
        return new SuccessResponse(data);
    }

    @Get('subaccounts')
    @Roles(UserRole.SuperAdmin)
    async all_contacts(@Request() req, @Query(new ValidationPipe({ transform: true })) query: PaginationDto) {
        const data = await this.currencyCloudService.getAllEnabledContacts(req.user);
        return new SuccessResponse(data);
    }

    @Get('contact/:contact_id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async contact(@Param('contact_id') contact_id: string, @Request() req) {
        const data = await this.currencyCloudService.getContact(contact_id, req.user);
        return new SuccessResponse(data);
    }

    @Get('settle_accounts/:currency/:account_id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async settle_accounts(@Param('currency') currency: string, @Param('account_id') account_id: string, @Request() req) {
        const data = await this.currencyCloudService.getSettleAccounts(currency, account_id, req.user);
        return new SuccessResponse(data);
    }

    @Post('create_quote')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create_quote(@Body() createCurrencyQuoteDto: CreateCurrencyQuote, @Request() req) {
        const quote = await this.currencyCloudService.postCurrencyQuote(createCurrencyQuoteDto, req.user);
        await this.transactionsService.createConversion(quote, req.user);
        return new SuccessResponse({ quote });
    }

    @Post('create_top_up')
    @Roles(UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create_top_up(@Body() createCurrencyTopUpDto: CreateCurrencyTopUp, @Request() req) {
        const top_up = await this.currencyCloudService.postCurrencyTopUp(createCurrencyTopUpDto, req.user);
        return new SuccessResponse({ top_up });
    }

    @Post('validate_payment')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    @UsePipes(new ValidationPipe({ transform: true }))
    async validate_payment(@Body() createValidatePaymentDto: CreateValidatePayment, @Request() req) {
        const payment = await this.currencyCloudService.validatePayment(createValidatePaymentDto, req.user);
        return new SuccessResponse({ payment });
    }

    @Post('create_payment')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create_payment(@Body() createValidatePaymentDto: CreateValidatePayment, @Request() req) {
        const status_approval = MemberRoles.includes(req.user.role) ? TransactionStatusApproval.Pending : TransactionStatusApproval.Done;

        const paymentTransaction = await this.transactionsService.create(
            {
                status: 'init',
                action: 'payment',
                gateway: 'currencycloud',
                account_id: req.user.getCurrentClient().account.cloudCurrencyId,
                client_uuid: req.user.getCurrentClient().uuid,
                balance_id: createValidatePaymentDto.currency,
                amount: createValidatePaymentDto.amount,
                currency: createValidatePaymentDto.currency,
                beneficiary_id: createValidatePaymentDto.beneficiary_id,
                reference: createValidatePaymentDto.reference,
                reason: createValidatePaymentDto.reason,
                payment_type: createValidatePaymentDto.payment_type,
                payment_date: createValidatePaymentDto.payment_date,
                status_approval,
                short_id: ''
            },
            req.user
        );

        if (!paymentTransaction)
            throw new BadRequestException({message: 'Transaction could not be created',});

        const beneficiary = await this.currencyCloudService.getBeneficiary(createValidatePaymentDto.beneficiary_id, req.user);
        const payerAndBankInfo = await this.currencyCloudService.getPayerAndBankInfo(paymentTransaction.client_uuid);

        if (status_approval === TransactionStatusApproval.Done) {
            const response = await this.currencyCloudService.createPayment(createValidatePaymentDto, req.user, paymentTransaction.uuid);
            if (response) {
                await this.transactionsService.updateTransactionId(
                    paymentTransaction.uuid,
                    response.id,
                    response.short_reference
                );

                return new SuccessResponse({
                    payment: {
                        ...response,
                        status_approval,
                        beneficiary,
                        payer: payerAndBankInfo.payer,
                        bank: payerAndBankInfo.bank
                    }
                });
            } 
            else {
                throw new BadRequestException({message: 'Payment could not be created on currencycloud'});
            }
        } 
        else {
            await this.currencyCloudService.notifyManagersToApprovePayment(
                paymentTransaction.account_id,
                paymentTransaction.uuid,
                req.user
            );

            return new SuccessResponse({
                payment: {
                    id: paymentTransaction.uuid,
                    amount: paymentTransaction.amount,
                    beneficiary_id: paymentTransaction.beneficiary_id,
                    currency: paymentTransaction.currency,
                    reference: paymentTransaction.reference,
                    reason: paymentTransaction.reason,
                    status: paymentTransaction.status,
                    status_approval,
                    creator_contact_id: paymentTransaction.account_id,
                    payment_type: paymentTransaction.payment_type,
                    payment_date: paymentTransaction.payment_date,
                    last_updater_contact_id: paymentTransaction.account_id,
                    created_at: paymentTransaction.createdAt,
                    updated_at: paymentTransaction.updatedAt,
                    unique_request_id: paymentTransaction.uuid,
                    beneficiary,
                    payer: payerAndBankInfo.payer,
                    bank: payerAndBankInfo.bank
                }
            });
        }
    }

    @Post('edit_payment')
    @Roles(...ManagerRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async edit_payment(@Body() createValidatePaymentDto: CreateValidatePayment, @Request() req) {
        const payment = await this.currencyCloudService.editPayment(createValidatePaymentDto, req.user);
        return new SuccessResponse({ payment });
    }

    @Post('delete_payment')
    @Roles(...ManagerRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async delete_payment(@Body() uuid: DeletePaymentDTO, @Request() req) {
        const payment = await this.currencyCloudService.deletePayment(uuid.uuid, req.user);
        return new SuccessResponse({ payment });
    }

    @Post('cancel_conversion')
    @Roles(...ManagerRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async cancel_conversion(@Body() uuid: DeletePaymentDTO, @Request() req) {
        const payment = await this.currencyCloudService.cancelConversion(uuid.uuid, req.user);
        return new SuccessResponse({ payment });
    }

    @Post('create_beneficiary')
    @Roles(...ManagerRoles)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create_beneficiary(@Body() createCurrencyBeneficiaryDto: CreateCurrencyBeneficiary, @Request() req) {
        const top_up = await this.currencyCloudService.postCurrencyBeneficiary(createCurrencyBeneficiaryDto, req.user);
        return new SuccessResponse({ top_up });
    }

    @Get('load_quote/:buy_currency/:sell_currency/:amount/:fixed_side/:date')
    @Roles(...UserRoles)
    async load_quote(
        @Param('buy_currency') buy_currency: string,
        @Param('sell_currency') sell_currency: string,
        @Param('amount') amount: string,
        @Param('fixed_side') fixed_side: string,
        @Param('date') date: string,
        @Request() req
    ) {
        const data = await this.currencyCloudService.getCurrencyQuote(
            buy_currency,
            sell_currency,
            fixed_side,
            amount,
            date,
            req.user
        );
        return new SuccessResponse(data);
    }

    @Post('delivery_date')
    @Roles(...UserRoles)
    async load_delivery_date(@Body() deliveryDateDTO: DeliveryDateDTO, @Request() req) {
        const data = await this.currencyCloudService.getDeliveryDate(
            deliveryDateDTO.currency,
            deliveryDateDTO.bank_country,
            deliveryDateDTO.payment_date,
            deliveryDateDTO.payment_type,
            req.user
        );
        return new SuccessResponse(data);
    }

    @Get('holidays/:country')
    @Roles(...UserRoles)
    async holidays(@Param('country') country: string) {
        const data = new Holidays(country, { types: ['bank', 'public'] });
        return new SuccessResponse(data);
    }

    @Get('conversion_dates/:pair')
    @Roles(...UserRoles)
    async conversion_dates(@Param('pair') conversion_pair: string, @Request() req) {
        const data = this.currencyCloudService.getConversionDates(conversion_pair, req.user);
        return new SuccessResponse(data);
    }

    @Get('payment_dates/:currency')
    @Roles(...UserRoles)
    async payment_dates(@Param('currency') currency: string, @Request() req) {
        const data = this.currencyCloudService.getPaymentDates(currency, req.user);
        return new SuccessResponse(data);
    }

    @Get('dashboard-info')
    @Roles(...UserRoles)
    async dashboardInfo(@Request() req) {
        const user = req.user;
        let today: any = new Date();
        today = today.toISOString();
        today = today.split('T')[0];
        const [funds, totalAwaitingFunds] =
            await this.transactionsService.searchTransactions(user, {
                settles_at_from: dayjs().format('YYYY-MM-DD'),
                status: 'pending',
                page: 1
            });

        const [failed, totalFailed] =
            await this.transactionsService.searchTransactions(user, {
                status: 'failed',
                page: 1
            });

        const [completedConversions, totalCompletedConversions] =
            await this.transactionsService.searchTransactions(user, {
                status: 'completed',
                action: 'conversion',
                completed_at_from: today,
                completed_at_to: today,
                page: 1
            });

        const [completedPayments, totalCompletedPayments] =
            await this.transactionsService.searchTransactions(user, {
                status: 'completed',
                action: 'payment',
                completed_at_from: today,
                completed_at_to: today,
                page: 1
            });

        const [completedTransactions, totalCompletedTransactions] =
            await this.transactionsService.searchTransactions(user, {
                status: 'completed',
                completed_at_from: today,
                completed_at_to: today,
                page: 1
            });

        const [pendingTransactions, totalPendingTransactions] =
            await this.transactionsService.searchTransactions(user, {
                status: 'pending',
                page: 1
            });

        const [rejectedPayments, totalRejectedPayments] =
            await this.transactionsService.searchTransactions(user, {
                status_approval: 'rejected',
                action: 'payment',
                page: 1
            });

        const [transactions, totalTransactions] =
            await this.transactionsService.searchTransactions(user, {
                page: 1
            });

        const [pendingApproval, totalPendingApproval] =
            await this.transactionsService.searchTransactions(user, {
                page: 1,
                status_approval: 'pending',
                action: 'payment'
            });

        const [expiredApproval, totalExpiredApproval] =
            await this.transactionsService.searchTransactions(user, {
                page: 1,
                status_approval: 'pending',
                action: 'payment',
                completed_at_to: today,
                completed_at_from: dayjs().subtract(100, 'years').format('YYYY-MM-DD')
            });

        const [lastThirtyDaysTransactions, totalLastThirtyDaysTransactions] =
            await this.transactionsService.searchTransactions(user, {
                status: 'completed',
                completed_at_from: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
                page: 1
            });

        return new SuccessResponse({
            expiredApproval: totalExpiredApproval,
            transactions: totalTransactions,
            pendingApproval: totalPendingApproval,
            awaitingFunds: totalAwaitingFunds,
            failedPayments: totalFailed,
            rejectedPayments: totalRejectedPayments,
            completedConversions: totalCompletedConversions,
            completedPayments: totalCompletedPayments,
            completedTransactions: totalCompletedTransactions,
            pendingTransactions: totalPendingTransactions,
            lastThirtyDaysTransactions: totalLastThirtyDaysTransactions
        });
    }

    @Get('search/transactions')
    @Roles(...UserRoles)
    async searchTransactions(@Request() req, @Query() query) {
        const user = req.user;
        const shortReference = query?.related_entity_short_reference;
        const action = query?.action;
        const settles_at_from = query?.settles_at_from;
        const settles_at_to = query?.settles_at_to;
        const created_at_from = query?.created_at_from;
        const created_at_to = query?.created_at_to;
        const completed_at_from = query?.completed_at_from;
        const completed_at_to = query?.completed_at_to;
        const status = query?.status;
        const type = query?.type;
        const amount_from = query?.amount_from;
        const amount_to = query?.amount_to;
        const currency = query?.currency;
        const scope = query?.scope;
        const page = query?.page;
        const results = await this.currencyCloudService.searchTransactions(
            user,
            shortReference,
            action,
            settles_at_from,
            settles_at_to,
            created_at_from,
            created_at_to,
            completed_at_from,
            completed_at_to,
            status,
            type,
            amount_from,
            amount_to,
            currency,
            scope,
            page
        );
        return new SuccessResponse(results);
    }

    @Post('approve_payment/:uuid')
    @Roles(...ManagerRoles)
    async approve_payment(@Param('uuid') uuid: string, @Body() body: TransactionDescriptionDto, @Request() req) {
        const accountId = req.user.getCurrentClient().account.cloudCurrencyId;
        const payment = await this.transactionsService.findByUuidAndAccountId(uuid, accountId);

        if (!payment)
            throw new NotFoundException('Payment not found');

        const response = await this.currencyCloudService.createPayment(
            {
                account_id: req.user.getCurrentClient().account.cloudCurrencyId,
                currency: payment.currency,
                purpose_code: payment.purpose_code,
                beneficiary_id: payment.beneficiary_id,
                amount: payment.amount,
                reason: payment.reason,
                reference: payment.reference,
                payment_type: payment.payment_type,
                payment_date: payment.payment_date
            },
            req.user,
            payment.uuid
        );

        if (response) {
            await this.transactionsService.updateStatusApprovalTransaction(
                uuid,
                TransactionStatusApproval.Done,
                body.description,
                response.id,
                req.user
            );
            await this.currencyCloudService.notifyUserApprovedPayment(
                payment.creator.username,
                req.user.firstname,
                payment.reference
            );
            return new SuccessResponse({ payment: response });
        } 
        else {
            throw new BadRequestException({message: 'Payment could not be created on currency cloud'});
        }
    }

    @Post('reject_payment/:uuid')
    @Roles(...ManagerRoles)
    async reject_payment(@Param('uuid') uuid: string, @Body() body: TransactionDescriptionDto, @Request() req) {
        const accountId = req.user.getCurrentClient().account.cloudCurrencyId;
        const payment = await this.transactionsService.findByUuidAndAccountId(uuid, accountId);

        if (!payment)
            throw new NotFoundException('Payment not found');

        if (payment.status_approval !== TransactionStatusApproval.Pending) 
            throw new BadRequestException('Status approval is not pending');

        await this.transactionsService.updateStatusApprovalTransaction(
            uuid,
            TransactionStatusApproval.Rejected,
            body.description,
            null,
            req.user
        );

        await this.currencyCloudService.notifyUserRejectedPayment(
            payment.creator.username,
            req.user.firstname,
            req.user.username,
            payment.reference,
            payment.description
        );

        return new SuccessResponse({status_approval: TransactionStatusApproval.Rejected});
    }

    @Get('search/pending')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async searchPendingTransactions(@Request() req, @Query() query) {
        const [transactions, totalElements] =
            await this.transactionsService.searchTransactions(req.user, query);

        const pageSize = 20;
        const pageNumber = Number(query.page || 1);
        const totalPages = Math.ceil(totalElements / pageSize);

        return new SuccessResponse({
            transactions: transactions.map((transaction) => convertData(transaction)),
            pagination: {
                current_page: pageNumber,
                next_page: totalPages > pageNumber ? pageNumber + 1 : -1,
                order: 'default',
                order_asc_desc: 'asc',
                per_page: pageSize,
                previous_page: pageNumber > 1 ? pageNumber - 1 : -1,
                total_entries: totalElements,
                total_pages: totalPages
            }
        });
    }

    @Get('search/pending/:uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async findPending(@Request() req, @Param('uuid') uuid: string) {
        const accountId = req.user.getCurrentClient().account.cloudCurrencyId;
        const transaction = await this.transactionsService.findByUuidAndAccountId(uuid, accountId);

        if (!transaction)
            throw new NotFoundException('Transaction not found');

        const beneficiary = await this.currencyCloudService.getBeneficiary(
            transaction.beneficiary_id,
            req.user
        );

        const payerAndBankInfo = await this.currencyCloudService.getPayerAndBankInfo(transaction.client_uuid);

        return new SuccessResponse({
            ...convertData(transaction),
            beneficiary,
            payer: payerAndBankInfo.payer,
            bank: payerAndBankInfo.bank
        });
    }
}

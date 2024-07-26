import { Controller, Get, NotFoundException, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@cdaxfx/tools-misc';
import { BeneficiariesRepository, ManagerRoles, TransactionStatus, TransactionStatusLabel, UserRole, UserRoles } from '@cdaxfx/tools-models';
import { Roles } from '../auth/roles.decorator';
import { FilterTransactionsDTO } from './model/filter-transactions.request.dto';
import { TransactionsService } from './services/transactions.service';
import dayjs from 'dayjs';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionsService: TransactionsService,
        private readonly beneficiariesRepository: BeneficiariesRepository
    ) { }

    @Get(':uuid')
    @Roles(UserRole.SuperAdmin, ...ManagerRoles)
    async fetch(@Param('uuid') uuid: string) {
        const data = await this.transactionsService.findByUuid(uuid);
        if (!data)
            throw new NotFoundException('Transaction not found');
        
        return new SuccessResponse({
            sell_currency: data.currency,
            buy_currency: data.currency,
            client_sell_amount: data.amount,
            client_buy_amount: data.buy_amount,
            short_reference: data.short_id,
            conversion_date: data.createdAt,
            core_rate: data.core_rate,
            client_rate: data.client_rate,
            account_id: data.account_id,
            action: data.action,
            amount: data.amount,
            balance_amount: null,
            balance_id: data.balance_id,
            completed_at: data.payment_date,
            created_at: data.createdAt,
            currency: data.currency,
            id: data.uuid,
            reason: data.reason,
            related_entity_id: data.transaction_id,
            related_entity_short_reference: data.short_id,
            related_entity_type: data.action,
            settles_at: data.payment_date,
            status: data.status,
            type: Number(data.amount) > 0 ? 'debit' : 'credit',
            updated_at: data.updatedAt,
            fee_amount: null,
            fee_currency: null
        });
    }

    @Get('search/transactions')
    @Roles(...UserRoles, UserRole.SuperAdmin)
    async searchTransactions(@Request() req, @Query() query: FilterTransactionsDTO) {
        const user = req.user.role !== UserRole.SuperAdmin ? req.user : null;
        const [transactions, totalElements] = await this.transactionsService.searchTransactions(user, query);
        const pageSize = 20;
        const pageNumber = Number(query.page || 1);
        const totalPages = Math.ceil(totalElements / pageSize);
        const beneficiariesIds = new Set(transactions.map((e) => e.beneficiary_id));

        const beneficiariesFounded = await this.beneficiariesRepository.find({
            currencyCloudId: { $in: [...beneficiariesIds.values()] }
        });

        const beneficiaries = Object.fromEntries(
            beneficiariesFounded.map((value) => [value.currencyCloudId, value])
        );

        return new SuccessResponse({
            transactions: transactions.map((transaction) => {
                return {
                    account_name: transaction?.client?.getAccountName(),
                    creator: transaction?.creator?.getFullName(),
                    account_id: transaction.account_id,
                    action: transaction.action,
                    amount: transaction.action !== 'conversion' ? transaction.amount : '',
                    buy_amount: transaction.action === 'conversion' ? transaction.buy_amount : '',
                    buy_currency: transaction.action === 'conversion' ? transaction.buy_currency : '',
                    sell_amount: transaction.action === 'conversion' ? transaction.amount : '',
                    sell_currency: transaction.action === 'conversion' ? transaction.currency : '',
                    balance_amount: null,
                    balance_id: transaction.account_id,
                    completed_at: transaction.gateway_completed_at,
                    created_at: transaction.createdAt,
                    currency: transaction.action !== 'conversion' ? transaction.currency : '',
                    id: transaction.uuid,
                    reason: transaction.reason,
                    related_entity_id: transaction.transaction_id,
                    related_entity_short_reference: transaction.short_id,
                    related_entity_type: transaction.action,
                    settles_at: transaction.action == 'payment' ? transaction.payment_date : transaction.settlement_date,
                    status: dayjs(
                        dayjs(
                            transaction.action == 'payment' ? transaction.payment_date : transaction.settlement_date).format('YYYY-MM-DD')
                    ).isAfter(dayjs())
                        ? TransactionStatus.Scheduled
                        : TransactionStatusLabel[transaction.status],
                    type: transaction.action == 'payment' ? 'debit' : 'credit',
                    updated_at: transaction.updatedAt,
                    client_rate: transaction.client_rate,
                    core_rate: transaction.core_rate,
                    fee_amount: transaction.fee_amount,
                    fee_currency: transaction.fee_currency,
                    gateway_fee_amount: transaction.gateway_fee_amount,
                    gateway_fee_currency: transaction.gateway_fee_currency,
                    gateway: transaction.gateway,
                    gateway_created_at: transaction.gateway_created_at,
                    gateway_spread_table: transaction.gateway_spread_table,
                    beneficiary: beneficiaries[transaction.beneficiary_id]?.getName(),
                    beneficiary_id: transaction.beneficiary_id
                };
            }),
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
}

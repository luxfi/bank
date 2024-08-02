import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transaction, TransactionsRepository, TransactionStatusApproval, User, TransactionAction, TransactionStatusMap, TransactionStatus, UserRole, CurrencyCloudConversion } from '@cdaxfx/tools-models';
import dayjs from 'dayjs';
import { FilterTransactions } from '../model/filter-transactions.request.dto';

@Injectable()
export class TransactionsService {
    private logger: Logger = new Logger(TransactionsService.name);

    constructor(private readonly transactionsRepository: TransactionsRepository) { }

    async searchTransactions(
        user: User | null,
        {
            shortReference,
            action,
            settles_at_from,
            settles_at_to,
            created_at_from,
            created_at_to,
            completed_at_from,
            completed_at_to,
            status,
            amount_from,
            amount_to,
            currency,
            page,
            account_id,
            gateway,
            client,
            status_approval,
            reference,
            beneficiary_id,
        }: FilterTransactions
    ) {
        const search = <any>{
            $and: [],
        };

        if (gateway)
            search.$and.push({ gateway });

        if (status === TransactionStatus.Scheduled)
            settles_at_from = dayjs().format('YYYY-MM-DD');

        if (status_approval === TransactionStatus.Expired) {
            status_approval = TransactionStatusApproval.Pending;
            completed_at_to = dayjs(completed_at_to).format('YYYY-MM-DD');
            completed_at_from = completed_at_from || dayjs().subtract(100, 'years').format('YYYY-MM-DD');
        }

        if (status && TransactionStatusMap[status])
            search.$and.push({ status: { $in: TransactionStatusMap[status] } });
        else if (!status_approval)
            search.$and.push({status: { $nin: ['init'] }});

        const settlesAtSearch = <any>{};
        if (settles_at_from)
            settlesAtSearch.$gte = settles_at_from;
        
        if (settles_at_to)
            settlesAtSearch.$lte = settles_at_to;
        
        if (Object.keys(settlesAtSearch).length) {
            search.$and.push({
                $or: [
                    { settlement_date: settlesAtSearch },
                    { payment_date: settlesAtSearch }
                ]
            });
        }

        const createdAtSearch = <any>{};
        if (created_at_from) 
            createdAtSearch.$gte = created_at_from;
        
        if (created_at_to)
            createdAtSearch.$lte = created_at_to;
        
        if (Object.keys(createdAtSearch).length) 
            search.$and.push({createdAt: createdAtSearch});
        
        const completedAtSearch = <any>{};
        if (completed_at_from)
            completedAtSearch.$gte = completed_at_from;
        else if (status_approval)
            completedAtSearch.$gte = dayjs().format('YYYY-MM-DD');

        if (completed_at_to) 
            completedAtSearch.$lte = completed_at_to;

        if (Object.keys(completedAtSearch).length) {
            search.$and.push({
                $or: [
                    { conversion_date: completedAtSearch },
                    { payment_date: completedAtSearch }
                ]
            });
        }

        const amountSearch = <any>{};

        if (amount_from)
            amountSearch.$gte = Number(amount_from);

        if (amount_to)
            amountSearch.$lte = Number(amount_to);

        if (Object.keys(amountSearch).length)
            search.$and.push({amount: amountSearch});

        if (currency)
            search.$and.push({$or: [{ currency: currency }, { buy_currency: currency }]});

        if (shortReference)
            search.$and.push({ short_id: shortReference });

        if (action)
            search.$and.push({ action });

        if (client)
            search.$and.push({account_id: client});

        if (status_approval)
            search.$and.push({status_approval: { $in: status_approval.split(',') }});
        
        if (reference)
            search.$and.push({reference: { $like: `%${reference}%` }});
        
        if (beneficiary_id)
            search.$and.push({beneficiary_id});

        if (!!user && !!user.getCurrentClient()) {
            const account = user.getCurrentClient()?.account;
            if (account)
                search.$and.push({account_id: account.gatewayId || account.cloudCurrencyId});
        }

        if (user?.role !== UserRole.SuperAdmin && user?.getCurrentClient()?.uuid)
            search.$and.push({client: {uuid: user.getCurrentClient()?.uuid}});

        return await this.transactionsRepository.findAndCount(search, {
            // strategy: LoadStrategy.JOINED,
            populate: [
                'creator',
                'beneficiary',
                'beneficiary.companyName',
                'beneficiary.firstname',
                'beneficiary.lastname',
                'creator.contact',
                'creator.clients',
                'creator.clients.account',
                'creator.clients.account.individualMetadata',
                'creator.clients.account.businessMetadata',
                'client.account',
                'client.account.individualMetadata',
                'client.account.businessMetadata',
            ],
            limit: 20,
            offset: (page - 1) * 20,
            orderBy: {
                createdAt: 'desc',
            }
        });
    }

    async findByUuid(uuid: string): Promise<Transaction | null> {
        return this.transactionsRepository.findOne({uuid: uuid});
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

    async findPaymentByUuid(uuid: string): Promise<Transaction | null> {
        return this.transactionsRepository.findOne({
            uuid: uuid,
            action: 'payment'
        });
    }

    async findByShortId(short_id: string, gateway: string): Promise<Transaction | null> {
        return this.transactionsRepository.findOne({short_id: short_id, gateway});
    }

    async findByTransactionId(transaction_id: string, gateway: string): Promise<Transaction | null> {
        return this.transactionsRepository.findOne(
            {
                transaction_id: transaction_id,
                gateway
            },
            {
                populate: ['approver']
            }
        );
    }

    async create(data: any, user: User): Promise<Transaction | null> {
        const transaction = await this.transactionsRepository.createTransaction(data, user);
        this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    async updateTransactionId(uuid: string, transaction_id: string, short_id: string) {
        const transaction = await this.transactionsRepository.findOne(uuid);

        if (!transaction)
            throw new NotFoundException('Transaction not found');

        transaction.transaction_id = transaction_id;
        transaction.short_id = short_id;

        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    async updateStatusApprovalTransaction(uuid: string, status_approval: TransactionStatusApproval, description: string, transaction_id: string | null, approver: User | null) {
        const transaction = await this.transactionsRepository.findOne(uuid);
        if (!transaction)
            throw new NotFoundException('Transaction not found');
        
        transaction.status_approval = status_approval;
        transaction.description = description;

        if (approver)
            transaction.approver = approver;

        if (transaction_id)
            transaction.transaction_id = transaction_id;

        await this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    async createConversion(quote: CurrencyCloudConversion, user: User) {
        const transaction = await this.transactionsRepository.createTransaction(
            {
                status: quote.status,
                action: TransactionAction.Conversion,
                gateway: 'currencycloud',
                account_id: user.getCurrentClient()?.account?.cloudCurrencyId,
                client_uuid: user.getCurrentClient()?.uuid,
                currency: quote.sell_currency,
                amount: quote.client_sell_amount,
                transaction_id: quote.id,
                short_id: quote.short_reference,
                client_rate: quote.client_rate,
                core_rate: quote.core_rate,
                buy_amount: quote.client_buy_amount,
                buy_currency: quote.buy_currency,
                fixed_side: quote.fixed_side,
                mid_market_rate: quote.mid_market_rate,
                conversion_date: quote.conversion_date,
                settlement_date: quote.settlement_date,
                gateway_created_at: quote.created_at,
                gateway_updated_at: quote.updated_at,
                partner_rate: quote.partner_rate,
                deposit_required: quote.deposit_required,
                deposit_amount: quote.deposit_amount,
                deposit_currency: quote.deposit_currency,
                deposit_status: quote.deposit_status,
                deposit_required_at: quote.deposit_required_at,
                status_approval: TransactionStatusApproval.Done
            },
            user
        );
        this.transactionsRepository.getEntityManager().persistAndFlush(transaction);
        return transaction;
    }

    async lastTransactionsIn30Days() {
        const count = await this.transactionsRepository.count({
            createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            status: TransactionStatus.Completed
        });

        return count;
    }
}

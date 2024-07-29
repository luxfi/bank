import { ECurrencyCode } from '@cdaxfx/tools-misc';
import { Transaction, TransactionStatusLabel, TransactionStatusMap, TransactionsRepository, User, TransactionStatus, TransactionStatusApproval, UserRole } from '@cdaxfx/tools-models';
import { ETransactionStatus, ETransactionType } from '@cdaxfx/ports-ifx';
import { GetTransactionsUseCase } from './abstract.handler';
import { ListTransactionsRequest } from './types/transactions.request.type';
import { GetTransactionsResponse, PaginationsResponse } from './types/transactions.response.type';
import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTransactionsDomainUseCase extends GetTransactionsUseCase {
    constructor(private readonly transactionsRepository: TransactionsRepository) {
        super();
    }

    async handle(query: ListTransactionsRequest, user: User): Promise<GetTransactionsResponse> {
        const {
            client,
            status,
            statusApproval,
            dateField,
            startDate,
            endDate,
            currency,
            minAmount,
            maxAmount,
            reference,
            account,
            page,
            limit,
            orderBy,
            order,
            beneficiary,
            type,
            gateway,
            cdaxId,
        } = query;

        const search = <any>{
            $and: []
        };

        const user_account = user.getCurrentClient()?.account?.gatewayId;

        if (account || (user_account && user.role !== UserRole.SuperAdmin))
            search.$and.push({account_id: account ?? user_account});

        if ((dateField && startDate) || (dateField && endDate)) {
            const map = {
                settlementAt: 'payment_date',
                createdAt: 'createdAt',
                completedAt: 'payment_date'
            };
            if (startDate)
                search.$and.push({ [map[dateField]]: { $gte: startDate } });
        
            if (endDate)
                search.$and.push({ [map[dateField]]: { $lte: endDate } });
        }

        if (status === TransactionStatus.Scheduled) {
            search.$and.push({
                $or: [
                    { settlement_date: { $gte: dayjs().format('YYYY-MM-DD') } },
                    { payment_date: { $gte: dayjs().format('YYYY-MM-DD') } },
                    { conversion_date: { $gte: dayjs().format('YYYY-MM-DD') } }
                ]
            });
        }

        if (status && TransactionStatusMap[status])
            search.$and.push({ status: { $in: TransactionStatusMap[status] } });
        else if (!statusApproval)
            search.$and.push({status: { $nin: ['init'] }});

        if (type)
            search.$and.push({ action: type });

        if (currency)
            search.$and.push({$or: [{ currency: currency }, { buy_currency: currency }]});

        if (beneficiary) 
            search.$and.push({ cdax_beneficiary_id: beneficiary });

        if (reference)
            search.$and.push({reference: { $like: `%${reference}%` }});

        const amountSearch = <any>{};
        if (minAmount) 
            amountSearch.$gte = Number(minAmount);
        if (maxAmount) 
            amountSearch.$lte = Number(maxAmount);

        if (Object.keys(amountSearch).length)
            search.$and.push({amount: amountSearch});

        if (gateway)
            search.$and.push({gateway: gateway});

        // logic only for statusApproval
        if (statusApproval) {
            const statusApprovals = statusApproval.split(',');
            const filterStatus = statusApprovals.filter((s) => s !== ETransactionStatus.EXPIRED);

            if (filterStatus.length) {
                search.$and.push({
                    status_approval: {
                        $in: filterStatus
                    }
                });
            }

            if (statusApprovals.length === 1 && statusApprovals.includes(ETransactionStatus.EXPIRED)) {
                search.$and.push({
                    payment_date: { $lte: dayjs().format('YYYY-MM-DD') }
                });

                search.$and.push({
                    status_approval: {$in: [ETransactionStatus.PENDING]}
                });
            }

            if (statusApprovals.length === 1 && statusApprovals.includes(ETransactionStatus.PENDING)) {
                search.$and.push({
                    payment_date: { $gte: dayjs().format('YYYY-MM-DD') }
                });
            }
        }

        if (user.role === UserRole.SuperAdmin && client) {
            search.$and.push({
                client: {
                    uuid: client
                }
            });
        }

        if (user.role !== UserRole.SuperAdmin) {
            search.$and.push({
                client: {
                    uuid: user.getCurrentClient()?.uuid
                }
            });
        }

        if (cdaxId)
            search.$and.push({cdax_id: cdaxId});

        const pageConfig = {
            page: page || 1,
            per_page: limit || 20,
            order: orderBy || 'updatedAt',
            order_asc_desc: order || 'desc'
        };

        const [transactions, count] =
            await this.transactionsRepository.findAndCount(search, {
                populate: [
                    'creator',
                    'beneficiary',
                    'cdax_beneficiary_id',
                    'creator.contact',
                    'creator.clients',
                    'creator.clients.account',
                    'creator.clients.account.individualMetadata',
                    'creator.clients.account.businessMetadata',
                    'client.account',
                    'client.account.individualMetadata',
                    'client.account.businessMetadata'
                ],
                limit: pageConfig.per_page,
                offset: (pageConfig.page - 1) * pageConfig.per_page,
                orderBy: {
                    [pageConfig.order]: pageConfig.order_asc_desc
                }
            });

        const pagination: PaginationsResponse = {
            totalEntries: count,
            totalPages: Math.ceil(count / pageConfig.per_page),
            page: pageConfig.page,
            limit: pageConfig.per_page
        };

        return {
            data: transactions.map((transaction: Transaction) => {
                return {
                    id: transaction.uuid.toString(),
                    status: TransactionStatusLabel[
                        transaction.status
                    ] as ETransactionStatus,
                    shortId: transaction.reference,
                    createdAt: transaction.createdAt.toString(),
                    updatedAt: transaction.updatedAt.toString(),
                    settlementAt:
                        transaction.action == 'payment'
                            ? transaction.payment_date
                            : transaction.settlement_date,
                    completedAt: transaction.gateway_completed_at,
                    creatorName: transaction?.creator?.getFullName(),
                    beneficiaryName: transaction?.beneficiary?.getName() ?? '',
                    clientName: transaction.client?.getAccountName() ?? '',
                    transactionType: transaction.action as ETransactionType,
                    approvalStatus:
                        transaction.status_approval === TransactionStatusApproval.Pending &&
                            dayjs(transaction.payment_date, 'YYYY-MM-DD').isBefore(
                                dayjs().format('YYYY-MM-DD')
                            )
                            ? TransactionStatusApproval.Expired
                            : transaction.status_approval,

                    reason: transaction.reason,
                    ...(user.role === UserRole.SuperAdmin
                        ? { cdaxFee: transaction.fee_amount }
                        : {}),
                    ...(user.role === UserRole.SuperAdmin
                        ? { spread: transaction.gateway_spread_table }
                        : {}),
                    in: {
                        amount: transaction.buy_amount,
                        currency: transaction.buy_currency as ECurrencyCode,
                    },
                    out: {
                        amount: transaction.amount ?? '',
                        currency: transaction.currency as ECurrencyCode,
                    },
                    cdaxId: transaction.cdax_id
                };
            }) as any,
            pagination
        };
    }
}

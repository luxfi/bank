import { Transaction, TransactionStatusApproval } from '@cdaxfx/tools-models';

import * as dayjs from 'dayjs';

export function convertData(transaction: Transaction) {
    return {
        id: transaction.uuid,
        action: transaction.action,
        account_name: transaction.creator ? transaction.creator.getFullName() : null,
        creator_email: transaction.creator?.username,
        contact_name: transaction.creator?.getContactName(),
        contact_email: transaction.creator?.username,
        account_id: transaction.account_id,
        amount_out: transaction.amount,
        description: transaction.description,
        created_at: transaction.createdAt,
        currency: transaction.currency,
        reason: transaction.reason,
        reference: transaction.reference,
        settles_at: transaction.settlement_date,
        status: transaction.status,
        status_approval:
            transaction.status_approval === TransactionStatusApproval.Pending && dayjs(transaction.payment_date, 'YYYY-MM-DD').isBefore(dayjs().format('YYYY-MM-DD'))
                ? TransactionStatusApproval.Expired
                : transaction.status_approval,
        updated_at: transaction.updatedAt,
        gateway: transaction.gateway,
        completed_date: transaction.payment_date,
        rejection_reason: transaction.description,
        approver: transaction.approver?.getFullName() ?? ''
    };
}

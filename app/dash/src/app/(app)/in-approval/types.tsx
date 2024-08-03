import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { ITransactionV2, TTransactionStatus } from '@/models/transactions';

import { formatCurrency, formatDateAndTime } from '@/utils/lib';
import { getBadgeStatusInApprovalValues } from '@/utils/valueMaps';

import { Column, TSelectOptions, Text } from '@luxbank/ui';

export interface IInApprovalFilters {
  statusApproval?: TTransactionStatus;
  status?: TTransactionStatus;
  startDate: string;
  endDate: string;
  currency: string;
  maxAmount: string;
  minAmount: string;
  cdaxId: string;
  beneficiary: string;

  dateField?: 'createdAt';
}

export const inApprovalStatusOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'In Approval', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
];

export const inApprovalColumns: IColumnProps<ITransactionV2>[] = [
  {
    title: 'TRANSACTION ID',
    dataIndex: 'cdaxId',
    sorter: false,
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'CREATOR',
    dataIndex: 'creatorName',
    sorter: false,
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'BENEFICIARY',
    dataIndex: 'beneficiaryName',
    sorter: false,
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'DATE',
    dataIndex: 'createdAt',
    sorter: false,
    render: (_, record) => {
      const value = `${record.createdAt ?? ''}`;
      if (!value) return '--';
      return (
        <Column>
          <Text variant="body_sm_regular">
            {formatDateAndTime(value)?.date}
          </Text>
          <Text variant="body_sm_regular" color="#002C52A3">
            {formatDateAndTime(value)?.time}
          </Text>
        </Column>
      );
    },
  },

  {
    title: 'Status',
    sorter: false,
    dataIndex: 'approvalStatus',
    show: true,
    render: (value) => {
      if (!value) return '--';
      return (
        <Badge
          type="dot"
          label={getBadgeStatusInApprovalValues[value]?.label}
          variant={getBadgeStatusInApprovalValues[value]?.variant}
        />
      );
    },
  },

  {
    title: 'Reason',
    dataIndex: 'reason',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },

  {
    title: 'Out',
    render: (data: ITransactionV2) => {
      if (!data.out.amount) return '--';
      return `- ${formatCurrency(Number(data.out.amount))} ${
        data.out.currency
      }`;
    },
  },
];

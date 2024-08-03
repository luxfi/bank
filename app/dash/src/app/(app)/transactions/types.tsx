import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { ITransactionV2, TTransactionStatus } from '@/models/transactions';

import {
  formatCurrency,
  formatDateAndTime,
  formatDateStringShortDate,
} from '@/utils/lib';
import { getBadgeStatusValues } from '@/utils/valueMaps';

import { Column, TSelectOptions, Text } from '@luxbank/ui';

export interface IColumnsCheckGroup {
  label: string;
  key: string;
  checked: boolean;
}

export interface ITransactionsFilters {
  statusApproval?: TTransactionStatus;
  status?: TTransactionStatus;
  dateField?: 'settlementAt' | 'createdAt' | 'completedAt';
  startDate?: string;
  endDate?: string;
  currency?: string;
  minAmount?: string;
  maxAmount?: string;
  cdaxId?: string;
  account?: string;
  type?: string;

  beneficiary?: string;

  creator?: string;
  client?: string;
  gateway?: 'ifx' | 'currencuCloud';
  scope?: 'own' | 'client';
}

// page?: number;
// limit?: number;

export interface IActionsGrid {
  modalIsIsArchiveVisible: boolean;
  uuidSelected: string;
}

export const TypeDateFilterOptions: TSelectOptions[] = [
  { label: 'Settlement Date', value: 'settlementAt' },
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Completed Date', value: 'completedAt' },
];

export const StatusFilterOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Deleted', value: 'deleted' },
  { label: 'Failed', value: 'failed' },
  { label: 'Scheduled', value: 'scheduled' },
];

export const TypeFilterOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'Payment', value: 'payment' },
  { label: 'Conversion', value: 'conversion' },
  { label: 'Inbound Funds', value: 'inbound_funds' },
];

export const ScopeOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'House Account', value: 'own' },
  { label: 'Clients', value: 'client' },
];

export const GatewayOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'IFX', value: 'ifx' },
  { label: 'Currency Cloud', value: 'currencyCloud' },
];

export const transactionColumns: IColumnProps<ITransactionV2>[] = [
  {
    title: 'Transaction ID',
    sorter: false,
    dataIndex: 'cdaxId',
    orderBy: 'reference',
    show: true,
    render: (_, record) => {
      const value = `${record?.cdaxId ?? ''}`;

      return <span>{value}</span>;
    },
  },
  {
    title: 'Creator',
    sorter: false,
    show: false,
    dataIndex: 'creatorName',
    orderBy: 'creator',
  },
  {
    title: 'Beneficiary',
    sorter: false,
    show: true,
    dataIndex: 'beneficiaryName',
    orderBy: 'beneficiary',
  },

  {
    title: 'Date',
    sorter: false,
    dataIndex: 'createdAt',
    orderBy: 'createdAt',
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
    dataIndex: 'status',
    show: true,
    render: (_, record) => {
      const value = record.status;

      if (!value) return '--';
      return (
        <Badge
          type="dot"
          label={getBadgeStatusValues[value]?.label}
          variant={getBadgeStatusValues[value]?.variant}
        />
      );
    },
  },
  {
    title: 'Type',
    dataIndex: 'action',
    show: true,
    render: (_, record) => {
      const capitalized =
        record.transactionType.charAt(0).toUpperCase() +
        record.transactionType.slice(1);
      return <span>{capitalized}</span>;
    },
  },
  {
    title: 'Reason',
    sorter: false,
    dataIndex: 'reason',
  },
  {
    title: 'In',
    dataIndex: 'in',
    show: true,
    render: (_, record) => {
      if (!record.in.amount) return '--';
      const value = `+ ${formatCurrency(Number(record.in.amount)) ?? ''} ${
        record.in.currency ?? ''
      }`;
      return value;
    },
  },
  {
    title: 'Out',
    dataIndex: 'out',
    show: true,
    render: (_, record) => {
      if (!record.out.amount) return '--';
      const value = `- ${formatCurrency(Number(record.out.amount)) ?? ''} ${
        record.out.currency ?? ''
      }`;
      return value;
    },
  },
];

export const transactionColumnsSuperAdmin: IColumnProps<ITransactionV2>[] = [
  {
    title: 'Transaction ID',
    sorter: false,
    show: true,
    width: 200,
    render: (_, record) => {
      const id = `${record?.cdaxId ?? '--'}`;
      const gateway = `${record?.gateway ?? '--'}`;

      return (
        <Column>
          <Text variant="body_sm_regular">{id}</Text>
          <Text variant="body_sm_regular" color="#002C52A3">
            {gateway}
          </Text>
        </Column>
      );
    },
  },
  {
    title: 'Account name',
    sorter: false,
    dataIndex: 'clientName',
    orderBy: 'client',
    show: true,
    width: 200,
  },
  {
    title: 'Creator',
    sorter: false,
    orderBy: 'creator',
    show: true,
    width: 200,
    dataIndex: 'creatorName',
  },
  {
    title: 'Date',
    sorter: false,
    dataIndex: 'createdAt',
    width: 150,
    render: (_, record) => {
      const value = `${record.createdAt ?? ''}`;

      return <span>{formatDateStringShortDate(value)}</span>;
    },
  },
  {
    title: 'Status',
    sorter: false,
    dataIndex: 'status',
    show: true,
    render: (_, record) => {
      const value = record.status;

      if (!value) return '--';
      return (
        <Badge
          type="dot"
          label={getBadgeStatusValues[value]?.label}
          variant={getBadgeStatusValues[value]?.variant}
        />
      );
    },
  },
  {
    title: 'Type',
    dataIndex: 'action',
    show: true,
    render: (_, record) => {
      const capitalized =
        record.transactionType.charAt(0).toUpperCase() +
        record.transactionType.slice(1);
      return <span>{capitalized}</span>;
    },
  },
  {
    title: 'Reason',
    sorter: false,
    show: false,
    dataIndex: 'reason',
    width: 200,
  },
  {
    title: 'In',
    dataIndex: 'in',
    show: true,
    width: 150,
    render: (_, record) => {
      if (!record.in.amount) return '--';
      const value = `+ ${formatCurrency(Number(record.in.amount)) ?? ''} ${
        record.in.currency ?? ''
      }`;
      return value;
    },
  },
  {
    title: 'Out',
    dataIndex: 'out',
    show: true,
    width: 150,
    render: (_, record) => {
      if (!record.out.amount) return '--';
      const value = `- ${formatCurrency(Number(record.out.amount)) ?? ''} ${
        record.out.currency ?? ''
      }`;
      return value;
    },
  },
  {
    title: 'CDAX Fee',
    dataIndex: 'cdaxFee',
    show: true,
    width: 200,
    render: (value) => {
      if (!value) return '--';
      return value;
    },
  },
  {
    title: 'Spread',
    dataIndex: 'spread',
    show: true,
    render: (value) => {
      if (!value) return '--';

      return value;
    },
  },
];

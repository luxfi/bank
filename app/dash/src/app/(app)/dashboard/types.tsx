import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { ITransactionV2, TTransactionStatus } from '@/models/transactions';

import { formatCurrency, formatDateAndTime } from '@/utils/lib';
import {
  getBadgeStatusValues,
  getRiskAssesmentStatusBadgeValues,
} from '@/utils/valueMaps';

import { Column, TSelectOptions, Text } from '@cdaxfx/ui';

export interface IInApprovalFilters {
  status?: TTransactionStatus;
  dateField?: 'settlementAt' | 'createdAt' | 'completedAt';
  startDate: string;
  endDate: string;
  currency: string;
  maxAmount: string;
  minAmount: string;
  reference: string;
  beneficiary: string;
}

export const inApprovalStatusOptions: TSelectOptions[] = [
  { label: 'All', value: '' },
  { label: 'In Approval', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Expired', value: 'expired' },
];

export const transactionsColumns: IColumnProps<ITransactionV2>[] = [
  {
    title: 'TRANSACTION ID',
    dataIndex: 'cdaxId',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'CREATOR',
    dataIndex: 'creatorName',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'BENEFICIARY',
    dataIndex: 'beneficiaryName',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'DATE',
    dataIndex: 'createdAt',
    render: (_, record) => {
      const value = `${record.createdAt ?? ''}`;
      if (!value) return '-';
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
    title: 'STATUS',
    dataIndex: 'status',
    show: true,
    render: (_, record) => {
      const value = record.status;

      if (!value) return '-';
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
    title: 'TYPE',
    dataIndex: 'transactionType',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },

  {
    title: 'OUT',
    render: (data: ITransactionV2) => {
      if (!data.out.amount) return '--';
      return `- ${formatCurrency(Number(data.out.amount))} ${
        data.out.currency
      }`;
    },
  },
];

export const clientsColumns: IColumnProps<ITransactionV2>[] = [
  {
    title: 'Client Account',
    dataIndex: 'name',
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },
  {
    title: 'Type',
    dataIndex: 'type',
    render: (data: string) => {
      if (!data) return '--';
      const capitalized = data.charAt(0).toUpperCase() + data.slice(1);
      return <Badge type="tag" label={capitalized} variant="neutral" />;
    },
  },
  {
    title: 'Risk Rating',
    dataIndex: 'riskRating',
    render: (data: string) => {
      if (!data) return '--';
      return (
        <Badge
          type="dot"
          label={getRiskAssesmentStatusBadgeValues[data.toLowerCase()]?.label}
          variant={
            getRiskAssesmentStatusBadgeValues[data.toLowerCase()]?.variant
          }
        />
      );
    },
  },
  {
    title: 'Last RA',
    dataIndex: 'lastRA',
    render: (data: string) => {
      if (!data) return '--';
      return formatDateAndTime(data)?.date;
    },
  },
  {
    title: 'Next RA',
    dataIndex: 'nextRA',
    render: (data: string) => {
      if (!data) return '--';
      return formatDateAndTime(data)?.date;
    },
  },
  {
    title: 'PEP',
    dataIndex: 'PEP',
    width: 100,
    render: (data: boolean) => {
      const no = <Badge type="tag" label="No" variant="neutral" />;
      const yes = <Badge type="tag" label="Yes" variant="negative" />;

      return data ? yes : no;
    },
  },
  {
    title: 'Country',
    dataIndex: 'country',
    width: 120,
    render: (data: string) => {
      if (!data) return '--';
      return data;
    },
  },

  {
    title: 'Actions',
    width: 200,
  },
];

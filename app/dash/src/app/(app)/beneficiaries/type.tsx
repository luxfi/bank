import { Badge } from '@/components/Badge';
import { ITableProps } from '@/components/Table';

import { UserRole } from '@/models/auth';
import { IBeneficiaryListResponse } from '@/models/beneficiaries';

import { Column, Text } from '@cdaxfx/ui';

export interface IBeneficiariesFilters {
  client?: string;
  beneficiary?: string;
  currency?: string;
  bankCountry?: string;
  status?: string;
  account?: string;
}

export const beneficiariesStatusOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
];

export const columns = (
  role?: UserRole
): ITableProps<IBeneficiaryListResponse>['columns'] => {
  return [
    ...(role === 'admin:super'
      ? [
          {
            title: 'Client Account',
            sorter: false,
            render: (data: IBeneficiaryListResponse) => (
              <Text variant="body_sm_regular">{data.account}</Text>
            ),
          },
        ]
      : []),
    {
      title: 'Beneficiary',
      sorter: false,
      render: (data: IBeneficiaryListResponse) => {
        // const date = formatDate(data.createdAt);
        // const firstName = data.firstname;
        // const lastName = data.lastname;
        // const companyName = data.companyName;
        // const label =
        //   data.entityType === 'business'
        //     ? companyName
        //     : `${firstName} ${lastName}`;

        return (
          <Column>
            <Text variant="body_sm_regular">{data.name}</Text>
            {/* <Text variant="caption_regular" color={textColor}>
              {date}
            </Text> */}
          </Column>
        );
      },
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      sorter: false,
      render: (value: string) => value || '--',
      width: 220,
    },
    {
      title: 'Bank Country',
      sorter: false,
      dataIndex: 'bankCountry',
      render: (value: string) => value || '--',
      width: 220,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: false,
      width: 200,
      render: (status: string) => {
        const variant = status === 'approved' ? 'positive' : 'warning';
        const label = status.charAt(0).toLocaleUpperCase() + status.slice(1);
        return <Badge label={label} variant={variant} type="dot" />;
      },
    },
    {
      title: 'Actions',
      width: 230,
    },
  ];
};

export const API_PATHS = {
  BENEFICIARIES: `/beneficiaries/api/beneficiaries-list`,
  BENEFICIARY_DETAIL: (uuid: string) =>
    `/beneficiaries/api/beneficiary-details?id=${uuid}`,
};

export interface IFilterType {
  status: string;
  name: string;
  currency: string;
  bankCountry: string;
}

export interface IFormParams {
  id?: string;

  address?: string;
  postCode?: string;
  addressLine2?: string;
  firstName?: string;
  lastName?: string;
  bankAccountCountry?: string;
  city?: string;
  state?: string;
  country?: string;
  currency?: string;
  entityType?: string;
  accountNumber?: string;
  bicSwift?: string;
  sortCode?: string;
  iban?: string;
  companyName?: string;
}

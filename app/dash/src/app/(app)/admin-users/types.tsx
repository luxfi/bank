import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { IUser } from '@/models/users';

import { getUserStatusBadgeValues } from '@/utils/valueMaps';

import { Column, Text } from '@luxbank/ui';

export interface IInviteSuperAdminPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  country: string;
}

export const columns: IColumnProps<any>[] = [
  {
    title: 'User',
    orderBy: 'name',
    render: (data: IUser) => {
      return (
        <Column gap="xxxs">
          <Text variant="body_sm_regular">{data.name}</Text>
          <Text variant="caption_regular" color={'#002C52A3'}>
            {data.email}
          </Text>
        </Column>
      );
    },
  },

  {
    title: 'Status',
    dataIndex: 'status',
    orderBy: 'status',
    width: 300,
    render: (data: string) => {
      return (
        <Badge
          type="dot"
          label={getUserStatusBadgeValues[data].label}
          variant={getUserStatusBadgeValues[data].variant}
        />
      );
    },
  },
  {
    title: 'Actions',
    width: 110,
  },
];

export interface IActionsGrid {
  modalIsIsArchiveVisible: boolean;
  uuidSelected: string;
  isLoading: boolean;
}

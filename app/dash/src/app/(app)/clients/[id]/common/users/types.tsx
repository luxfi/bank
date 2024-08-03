import { Badge } from '@/components/Badge';

import { getUserStatusBadgeValues } from '@/utils/valueMaps';

import { userRolesDictionary } from '@/app/(app)/users/types';
import { Column, Text } from '@cdaxfx/ui';

export const userColumns = [
  {
    title: 'NAME',
    orderBy: 'username',
    sorter: false,
    render: (data: any) => {
      return (
        <Column gap="xxxs">
          <Text variant="body_sm_regular">{`${data.firstname} ${data.lastname}`}</Text>
          <Text variant="caption_regular" color={'#002C52A3'}>
            {data.username}
          </Text>
        </Column>
      );
    },
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    orderBy: 'status',
    render: (data: string) => {
      return (
        <Badge
          type="dot"
          label={getUserStatusBadgeValues[data]?.label ?? 'Pending'}
          variant={getUserStatusBadgeValues[data]?.variant ?? 'warning'}
        />
      );
    },
  },
  {
    title: 'ROLE',
    dataIndex: 'role',
    orderBy: 'role',
    render: (data: string) => {
      return <Text variant="body_sm_regular">{userRolesDictionary[data]}</Text>;
    },
  },
  {
    title: 'Actions',
    width: 100,
  },
];

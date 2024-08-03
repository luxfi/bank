import { Badge } from '@/components/Badge';
import { IColumnProps } from '@/components/Table';

import { userRolesDictionary } from '@/app/(app)/users/types';
import { ILinkedUser } from '@/store/useClient/types';
import { Column, Text } from '@cdaxfx/ui';

export const columns: IColumnProps<ILinkedUser>[] = [
  {
    title: 'USER',
    render: (data: ILinkedUser) => {
      if (!data) return '--';
      return (
        <Column>
          <Text variant="body_md_regular">{`${data.firstname} ${data.lastname}`}</Text>
          <Text
            variant="caption_regular"
            color={'#002C52A3'}
          >{`${data.username}`}</Text>
        </Column>
      );
    },
  },
  {
    title: 'STATUS',
    dataIndex: 'verified',
    render: (data: boolean) => {
      return (
        <Badge
          type="dot"
          label={data ? 'Active' : 'Pending'}
          variant={data ? 'positive' : 'warning'}
        />
      );
    },
  },
  {
    title: 'ROLE',
    dataIndex: 'role',
    render: (data) => {
      if (!data) return '--';
      return (
        <Text variant="body_sm_semibold">{userRolesDictionary[data]}</Text>
      );
    },
  },
  {
    title: 'Actions',
    width: 220,
  },
];

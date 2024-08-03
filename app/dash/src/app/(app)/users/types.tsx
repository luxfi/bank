import { Badge } from '@/components/Badge';

import { UserRole } from '@/models/auth';
import { IUser, TUserStatus } from '@/models/users';

import { getUserStatusBadgeValues } from '@/utils/valueMaps';

import { Column, TSelectOptions, Text } from '@luxbank/ui';

export const userRolesDictionary: Record<string, string> = {
  'user:admin': 'Admin',
  'user:manager': 'Team Manager',
  'user:member': 'Team Member',
  'user:viewer': 'Viewer',
  'admin:super': 'CDAX Team',
};

export const userRoles = (currentUserRole?: UserRole): TSelectOptions[] => {
  const roles = Object.entries(userRolesDictionary).map(([key, value]) => ({
    value: key,
    label: value,
  }));

  if (currentUserRole === UserRole.TeamManager) {
    return roles.filter(
      (r) => r.value !== 'user:admin' && r.value !== 'admin:super'
    );
  }
  if (currentUserRole === UserRole.TeamMember) {
    return roles.filter(
      (r) =>
        r.value !== 'user:admin' &&
        r.value !== 'user:manager' &&
        r.value !== 'admin:super'
    );
  }

  if (currentUserRole === UserRole.ViewerUser) {
    return roles.filter(
      (r) =>
        r.value !== 'user:admin' &&
        r.value !== 'user:manager' &&
        r.value !== 'user:member' &&
        r.value !== 'admin:super'
    );
  }

  if (currentUserRole === UserRole.AdminUser) {
    return roles.filter((r) => r.value !== 'admin:super');
  }

  // if Super Admin return all
  return roles;
};

export interface IUsersFilters {
  userId?: string;
  client?: string;
  role?: UserRole;
  status?: 'all' | TUserStatus;
}

export const UserStatusOptions = [
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

export const RolesOptions = [
  { label: 'All', value: '' },
  ...userRoles(UserRole.AdminUser),
];

export const userColumns = [
  {
    title: 'NAME',
    orderBy: 'username',
    sorter: false,
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
    title: 'STATUS',
    dataIndex: 'status',
    orderBy: 'status',
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

export const superAdminColumns = [
  {
    title: 'NAME',
    orderBy: 'username',
    width: 400,
    sorter: false,
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
    title: 'CLIENT',
    dataIndex: 'client',
    orderBy: 'client',
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    orderBy: 'status',
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

'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import Table, { ISorting } from '@/components/Table';
import Tabs from '@/components/Tabs';

import { UserRole } from '@/models/auth';

import { useNotification } from '@/context/Notification';

import { useUsers } from '@/store/useUsers';
import { IUsersResponse } from '@/store/useUsers/types';
import {
  Button,
  Input,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import _ from 'underscore';

import { IUsersFilters } from '../users/types';
import { Container } from './styles';
import { columns } from './types';

export default function AdminUsers() {
  const { onShowNotification } = useNotification();
  const router = useRouter();
  const { theme } = useTheme();

  const { errors, loading, getUsers } = useUsers();
  const [users, setUsers] = useState<IUsersResponse>({} as IUsersResponse);

  const [usersCount, setUsersCount] = useState({
    active: 0,
    archived: 0,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
  });

  const [sorting, setSorting] = useState<ISorting>({
    orderBy: '',
    order: undefined,
  });

  const getUsersList = useCallback(
    async (filters?: Partial<IUsersFilters>) => {
      const { page, limit } = pagination;
      const { orderBy, order } = sorting;

      await getUsers({
        ...filters,
        page,
        limit,
        orderBy,
        order,
        role: UserRole.SuperAdmin,
      }).then((users) => {
        setUsers(users);
        setPagination((p) => ({
          ...p,
          total: users?.pagination?.totalEntries,
        }));
      });
    },
    [getUsers, pagination, sorting]
  );

  const getTotals = async () => {
    //get total to show on tabs
    Promise.all([
      getUsers({
        role: UserRole.SuperAdmin,
        page: 1,
        limit: 1,
      }).then(({ pagination }) => pagination.totalEntries),
      getUsers({
        role: UserRole.SuperAdmin,
        page: 1,
        limit: 1,
        status: 'archived',
      }).then(({ pagination }) => pagination.totalEntries),
    ]).then(([active, archived]) => {
      setUsersCount({
        active,
        archived,
      });
    });
  };

  const handleSearch = _.debounce((value: string) => {
    if (value.length < 3) return;
    getUsersList({ name: value } as IUsersFilters);
  }, 1000);

  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, [pagination.page, sorting.orderBy, sorting.order]);

  useEffect(() => {
    getTotals();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (errors.getUsers) {
      onShowNotification({
        type: 'ERROR',
        message: 'Something went wrong',
        description: errors.getUsers,
      });
    }
  }, [errors, onShowNotification]);

  const TableComponent = useMemo(
    () => (
      <Table
        columns={columns}
        dataSource={users.data}
        loading={loading.getUsers}
        rowKey={(r) => r.uuid || r.id}
        actionsContainer={(user) => {
          return (
            <ButtonWithIcon
              label="Details"
              icon="notebook-1"
              iconColor={
                theme.backgroundColor.interactive['primary-default'].value
              }
              onClick={() => router.push(`/admin-users/${user.id}`)}
            />
          );
        }}
        pagination={{
          onChangePage: (page) => {
            setPagination((prev) => ({
              ...prev,
              page,
            }));
          },
          totalPage: pagination.total,
          currentPage: pagination.page,
          currentPageSize: pagination.limit,
        }}
        onSortChange={({ field, sort }) => {
          setSorting({ orderBy: field, order: sort });
        }}
      />
    ),
    [
      users.data,
      loading.getUsers,
      pagination.total,
      pagination.page,
      pagination.limit,
      theme.backgroundColor.interactive,
      router,
    ]
  );

  const tabs = [
    {
      key: '1',
      label: `Active Users (${usersCount.active || '0'})`,
      children: TableComponent,
    },
    {
      key: '2',
      label: `Archived Users (${usersCount.archived || '0'})`,
      children: TableComponent,
    },
  ];
  return (
    <Container>
      <Row justify="space-between" align="center">
        <Text variant="headline_regular">CDAX Team</Text>
        <Row gap="md" align="center">
          <Row gap="xxxs" align="center">
            <Input
              placeholder="Search by user name"
              leadingIcon="magnifer"
              roundness="rounded"
              onChangeText={(e) => {
                if (!e) getUsersList();
                handleSearch(e);
              }}
            />
          </Row>

          <Button
            leftIcon="plus-square"
            roundness="rounded"
            onClick={() => router.push('/admin-users/new')}
            text="Add CDAX Member"
          />
        </Row>
      </Row>

      <Tabs
        defaultActiveKeyTab={1}
        items={tabs}
        onChange={(tabIndex) => {
          if (tabIndex === 1) {
            getUsersList();
          }
          if (tabIndex === 2) {
            getUsersList({ status: 'archived' } as IUsersFilters);
          }
        }}
      />
    </Container>
  );
}

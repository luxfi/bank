'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { Divider } from '@/components/Divider';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import ModalResult from '@/components/ModalResult';
import Select from '@/components/Select';
import Table, { ISorting } from '@/components/Table';
import Tabs from '@/components/Tabs';
import { UserAvatar } from '@/components/UserAvatar';

import { AdminOrManager, UserRole } from '@/models/auth';
import { IUser } from '@/models/users';

import { useNotification } from '@/context/Notification';

import useUrlSearchParams from '@/hooks/useUrlParams';
import { useAuth } from '@/store/useAuth';
import { useFilterSelect } from '@/store/useFilterSelect';
import { IFilterSelect } from '@/store/useFilterSelect/types';
import { useUsers } from '@/store/useUsers';
import { IUsersResponse } from '@/store/useUsers/types';
import { Button, Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';
import { Modal } from 'antd';
import _ from 'underscore';

import { Container } from './styles';
import {
  IUsersFilters,
  RolesOptions,
  UserStatusOptions,
  superAdminColumns,
  userColumns,
} from './types';

export default function Users() {
  const router = useRouter();
  const { onShowNotification } = useNotification();
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const { id }: { id?: string } = useParams();
  const { getUsersSelect, getClientsSelect } = useFilterSelect();
  const [users, setUsers] = useState<IUsersResponse>({} as IUsersResponse);

  const [loadingSelect, setLoadingSelect] = useState(false);
  const { errors, loading, getUsers, archiveUser, restoreUser } = useUsers();

  const [selectedUser, setSelectedUser] = useState<IUser>();

  const [usersCount, setUsersCount] = useState({
    active: 0,
    archived: 0,
  });

  const [usersOptions, setUsersOptions] = useState<
    {
      value: string;
      label: string;
      subLabel?: string;
      searchBy?: string;
    }[]
  >([]);

  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [confirmatioModal, setConfirmationModal] = useState({
    open: false,
    type: '',
  });
  const [resultModalInfo, setResultModalInfo] = useState({
    title: '',
    subtitle: '',
    open: false,
  });

  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
  });

  const [sorting, setSorting] = useState<ISorting>({
    orderBy: '',
    order: undefined,
  });

  const {
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
    urlParams,
    isFiltered,
  } = useUrlSearchParams<IUsersFilters>({
    permanentParams: id ? ['client'] : [],
  });

  const getUsersList = useCallback(
    async (filters: IUsersFilters = urlParams, currentTab?: number) => {
      applyUrlParams();
      setFiltersOpen(false);

      const tab = currentTab || activeTab;

      const { page, limit } = pagination;
      const { orderBy, order } = sorting;

      const payload = {
        ...filters,
        page,
        limit,
        orderBy,
        order,
        status: tab === 2 ? 'archived' : filters.status,
      };

      await getUsers(payload).then((res) => {
        setUsers(res);
      });
    },
    [urlParams, applyUrlParams, activeTab, pagination, sorting, getUsers]
  );

  const getTotals = async () => {
    Promise.all([
      getUsers({ page: 1, limit: 1 }).then(({ pagination }) =>
        setUsersCount((prev) => ({
          ...prev,
          active: pagination.totalEntries,
        }))
      ),
      getUsers({ page: 1, limit: 1, status: 'archived' }).then(
        ({ pagination }) =>
          setUsersCount((prev) => ({
            ...prev,
            archived: pagination.totalEntries,
          }))
      ),
    ]);
  };

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: users?.pagination?.totalEntries,
    }));
  }, [users?.pagination?.totalEntries]);

  useEffect(() => {
    if (errors.getUsers) {
      onShowNotification({
        type: 'ERROR',
        message: 'Something went wrong',
        description: errors.getUsers,
      });
    }
  }, [errors, onShowNotification]);

  const handleSetFilters = (
    type: keyof IUsersFilters,
    value?: string | string[],
    fetch?: boolean
  ): void => {
    let newValue = value;
    if (typeof newValue !== 'string') {
      newValue = (value as string[]).join("");
    }
    setUrlSearchParam(type, newValue);
    const updatedFilters = {
      ...urlParams,
      [type]: value,
    };
    if (fetch) getUsersList(updatedFilters as IUsersFilters);
  };

  const handleClearFilters = useCallback(
    (apply?: boolean) => {
      clearUrlSearchParams();

      const query = id ? { client: id } : {};
      if (apply) getUsersList(query as IUsersFilters);
    },
    [clearUrlSearchParams, getUsersList, id]
  );

  const handleArchiveUser = async () => {
    if (!selectedUser) return;
    await archiveUser(selectedUser.id as string)
      .then(() => {
        setResultModalInfo({
          title: `User ${selectedUser?.name} archived succesfully.`,
          subtitle: '',
          open: true,
        });
        getUsersList();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error archiving user',
          description: err.message,
        });
      });
  };

  const handleRestoreUser = () => {
    if (!selectedUser) return;
    restoreUser(selectedUser.id as string)
      .then(() => {
        setResultModalInfo({
          title: `User ${selectedUser?.name} restored succesfully.`,
          subtitle: '',
          open: true,
        });
        getUsersList();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error restoring user',
          description: err.message,
        });
      });
  };

  const getActionButton = useCallback(
    (user: IUser) => {
      if (currentUser?.role !== UserRole.SuperAdmin) {
        return (
          <ButtonWithIcon
            label="Details"
            icon="notebook-1"
            iconColor={
              theme.backgroundColor.interactive['primary-default'].value
            }
            onClick={() => router.push(`/users/${user.id}`)}
          />
        );
      }
      if (activeTab === 1) {
        return (
          <ButtonWithIcon
            label="Archive"
            icon="archive"
            iconColor={theme.backgroundColor.feedback.negativeAccent.value}
            onClick={() => {
              setSelectedUser(user);
              setConfirmationModal({
                open: true,
                type: 'archive',
              });
            }}
          />
        );
      }
      if (activeTab === 2) {
        return (
          <ButtonWithIcon
            label="Restore"
            icon="restart"
            iconColor={theme.backgroundColor.feedback.positiveAccent.value}
            onClick={() => {
              setSelectedUser(user);
              setConfirmationModal({
                open: true,
                type: 'restore',
              });
            }}
          />
        );
      }
    },
    [activeTab, currentUser?.role, router, theme]
  );

  const TableComponent = useCallback(
    () => (
      <Table
        columns={
          currentUser?.role === UserRole.SuperAdmin
            ? superAdminColumns
            : userColumns
        }
        dataSource={users.data}
        loading={loading.getUsers}
        rowKey={(r) => r.uuid || r.id}
        onSortChange={({ field, sort }) => {
          setSorting({ orderBy: field, order: sort });
        }}
        actionsContainer={(user: IUser) => getActionButton(user)}
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
      />
    ),
    [
      currentUser?.role,
      users.data,
      loading.getUsers,
      pagination.total,
      pagination.page,
      pagination.limit,
      getActionButton,
    ]
  );

  const tabs = useMemo(
    () => [
      {
        key: '1',
        label: `Active Users (${usersCount.active || '0'})`,
        children: <TableComponent />,
      },
      {
        key: '2',
        label: `Archived Users (${usersCount.archived || '0'})`,
        children: <TableComponent />,
      },
    ],
    [usersCount.active, usersCount.archived, TableComponent]
  );

  const getUsersOptions = _.debounce(async (userName?: string) => {
    if (userName && userName?.length < 3) return;
    setLoadingSelect(true);
    const userOptions = await getUsersSelect({
      name: userName,
      limit: 5,
      page: 1,
    })
      .then((r: IFilterSelect[]) => {
        return r.map((u) => ({
          value: u.id,
          label: u.name,
          subLabel: u.email,
          searchBy: u.name + u.email,
        }));
      })
      .finally(() => setLoadingSelect(false));
    setUsersOptions(userOptions);
  }, 500);

  const getClientsOptions = _.debounce(async (clientName?: string) => {
    if (clientName && clientName?.length < 3) return;
    setLoadingSelect(true);
    const clientOptions = await getClientsSelect({
      name: clientName,
      limit: 5,
      page: 1,
    })
      .then((r: IFilterSelect[]) => {
        return r.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      })
      .finally(() => setLoadingSelect(false));
    setClientOptions(clientOptions);
  }, 500);

  useEffect(() => {
    getUsersList();
    // eslint-disable-next-line
  }, [pagination.page, sorting.orderBy, sorting.order]);

  useEffect(() => {
    getUsersOptions();

    if (currentUser?.role === UserRole.SuperAdmin) {
      getTotals();
      getClientsOptions();
    }
    //eslint-disable-next-line
  }, [currentUser]);

  return (
    <>
      <Container>
        <Row justify="space-between" padding="sm">
          <Text variant="headline_regular">Users</Text>

          {currentUser?.role && AdminOrManager.includes(currentUser?.role) && (
            <Button
              text="Invite a user"
              roundness="rounded"
              leftIcon="user-plus"
              onClick={() => router.push('/users/invite')}
            />
          )}
        </Row>
        {currentUser?.role !== UserRole.SuperAdmin && (
          <Row justify="space-between" padding="sm">
            <UserAvatar
              name={`${currentUser?.firstname} ${currentUser?.lastname}`}
              initials={`${currentUser?.firstname[0]}${currentUser?.lastname[0]}`}
              username={currentUser?.username}
              role={currentUser?.role}
            />

            <Button
              roundness="rounded"
              variant="secondary"
              text="My profile"
              onClick={() => router.push('/users/profile')}
            />
          </Row>
        )}
        <Column gap="sm" padding="sm">
          <Button
            text="Filters"
            roundness="rounded"
            variant="secondary"
            leftIcon="filter"
            size="small"
            onClick={() => setFiltersOpen(true)}
          />
          <FilterTagsGroup
            show={isFiltered}
            dictionary={[
              ...UserStatusOptions,
              ...RolesOptions,
              ...clientOptions,
              ...usersOptions,
            ]}
            filters={urlParams}
            filtersToIgnore={id ? ['client'] : []}
            onRemove={(k, v) => {
              if (k === 'clear') {
                handleClearFilters(true);
                return;
              }
              handleSetFilters(k, v, true);
            }}
          />
        </Column>

        {currentUser?.role === UserRole.SuperAdmin && !id ? (
          <Tabs
            defaultActiveKeyTab={1}
            items={tabs}
            onChange={async (tabIndex) => {
              setActiveTab(tabIndex);

              setUsers({} as IUsersResponse);
              if (tabIndex === 1) {
                getUsersList({ ...urlParams, status: 'all' }, 1);
              }
              if (tabIndex === 2) {
                getUsersList(
                  {
                    ...urlParams,
                    status: 'archived',
                  } as IUsersFilters,
                  2
                );
              }
            }}
          />
        ) : (
          <TableComponent />
        )}
      </Container>
      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)}>
        <Column gap="lg">
          <Text variant="headline_regular">Filters</Text>
          <Divider />
          <Column width="100%" gap="sm">
            <Select
              label="User"
              placeholder="All"
              onChange={(v) => handleSetFilters('userId', v)}
              value={urlParams?.userId}
              options={usersOptions}
              showSearch
              onSearch={(v) => getUsersOptions(v)}
              isLoading={loadingSelect}
            />
            {currentUser?.role === UserRole.SuperAdmin && !id && (
              <Select
                label="Client "
                placeholder="All"
                onChange={(v) => handleSetFilters('client', v)}
                value={urlParams?.client}
                options={clientOptions}
                showSearch
                onSearch={(v) => getClientsOptions(v)}
                isLoading={loadingSelect}
              />
            )}
            <Select
              label="Status"
              placeholder="All"
              options={UserStatusOptions}
              onChange={(v) => handleSetFilters('status', v)}
              value={urlParams?.status}
            />
            <Select
              label="Role"
              placeholder="All"
              options={RolesOptions}
              onChange={(v) => handleSetFilters('role', v)}
              value={urlParams?.role}
            />
            <Row justify="flex-end" gap="sm" width="100%">
              <Button
                text="Clear"
                roundness="rounded"
                variant="tertiary"
                onClick={() => handleClearFilters()}
              />
              <Button
                text="Apply"
                roundness="rounded"
                onClick={() => getUsersList()}
              />
            </Row>
          </Column>
        </Column>
      </Drawer>

      <Modal
        open={confirmatioModal.open}
        onCancel={() =>
          setConfirmationModal({ ...confirmatioModal, open: false })
        }
        centered
        footer={
          <Row gap="sm" justify="flex-end">
            <Button
              text="No"
              roundness="rounded"
              variant="secondary"
              size="small"
              onClick={() =>
                setConfirmationModal({ ...confirmatioModal, open: false })
              }
            />
            <Button
              text="Yes"
              roundness="rounded"
              variant="primary"
              size="small"
              onClick={() => {
                setConfirmationModal({ ...confirmatioModal, open: false });
                if (confirmatioModal.type === 'archive') handleArchiveUser();
                if (confirmatioModal.type === 'restore') handleRestoreUser();
              }}
            />
          </Row>
        }
      >
        <Column gap="sm" padding="md">
          <Row gap="sm">
            <Icon variant="exclamation-circle" />
            <Text variant="interactive_md_bold">
              {`Are you sure you want to ${confirmatioModal.type} the user ${selectedUser?.name} ?`}
            </Text>
          </Row>
        </Column>
      </Modal>

      <ModalResult
        type="SUCCESS"
        isVisible={resultModalInfo.open}
        onCancel={() => {
          setResultModalInfo({ ...resultModalInfo, open: false });
        }}
        title={resultModalInfo.title}
        subtitle={resultModalInfo.subtitle}
      />
    </>
  );
}

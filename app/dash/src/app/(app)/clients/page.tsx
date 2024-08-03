'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { Divider } from '@/components/Divider';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import { ModalCheckCodeImpersonate } from '@/components/ModaCodeImpersonate';
import Select from '@/components/Select';
import Table from '@/components/Table';

import { UserRole } from '@/models/auth';
import { IClients, IUserClient } from '@/models/clients';

import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import useUrlSearchParams from '@/hooks/useUrlParams';
import { useAuth } from '@/store/useAuth';
import { useClients } from '@/store/useClient';
import { Button, Column, Icon, Input, Row, Text, useTheme } from '@luxbank/ui';

import { filterClientsTable } from './helpers';
import {
  ButtonActionDetails,
  Container,
  ContainerActionDetails,
  HeaderContainer,
  TableContainer,
  TableContainerExpandable,
  Title,
} from './styles';
import {
  IClientsFilters,
  clientTypeOptions,
  columns,
  columnsExpandable,
  countryOptions,
  pepOptions,
  riskRatingOptions,
} from './types';

export default function Clients() {
  const router = useRouter();

  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { onShowNotification } = useNotification();
  const { getClients, archiveClient } = useClients();
  const { setImpersonate } = useAuth();

  const {
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
    urlParams,
    isFiltered,
  } = useUrlSearchParams<IClientsFilters>();

  const [loading, setLoading] = useState<boolean>(true);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  const [modalImpersonate, setModalImpersonate] = useState({
    isVisible: false,
    accountName: '',
  });

  const [dataSource, setDataSource] = useState<Array<IClients>>([]);
  const [filteredData, setFilteredData] = useState<Array<IClients>>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchClients = useCallback(
    async (payload: IClientsFilters = urlParams) => {
      applyUrlParams();
      setFiltersOpen(false);

      //const { page, limit } = pagination;
      //const { orderBy, order } = sorting;

      try {
        setLoading(true);
        const response = await getClients({ ...payload, page: 1, limit: 1000 });
        setDataSource(response.data);
        setFilteredData(response.data);
      } catch (error) {
        onShowNotification({
          type: 'ERROR',
          message: 'Error getting clients list!',
          description: (error as any)?.message ?? '',
        });
      } finally {
        setLoading(false);
      }
    },
    [applyUrlParams, getClients, onShowNotification, urlParams]
  );

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = useCallback(
    (payload: IClientsFilters = urlParams, search?: string) => {
      applyUrlParams();
      setFiltersOpen(false);
      const filtered = filterClientsTable(dataSource, payload, search);

      setFilteredData(filtered);
    },
    [applyUrlParams, urlParams, dataSource]
  );

  const handleSetFilters = useCallback(
    (type: keyof IClientsFilters, value?: string, fetch?: boolean): void => {
      setUrlSearchParam(type, value);

      const updatedFilters = {
        ...urlParams,
        [type]: value,
      };

      if (fetch) handleFilter(updatedFilters);
    },
    [setUrlSearchParam, urlParams, handleFilter]
  );

  const handleClearFilters = useCallback(
    (apply?: boolean) => {
      clearUrlSearchParams();

      if (apply) handleFilter({} as IClientsFilters);
      return;
    },
    [clearUrlSearchParams, handleFilter]
  );

  useLayoutEffect(() => {
    if (loading) return;
    handleFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <>
      <Container>
        <HeaderContainer>
          <Title>Clients</Title>

          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              roundness="rounded"
              placeholder="Search client or account"
              leadingIcon="magnifer"
              onChangeText={(e) => {
                handleFilter(urlParams, e);
              }}
            />
            <Button
              text="Add Account"
              leftIcon="plus-square"
              roundness="rounded"
              onClick={() => router.push('/clients/new')}
            />
          </div>
        </HeaderContainer>
        <Column gap="xs">
          <Button
            onClick={() => setFiltersOpen(true)}
            text="Filters"
            leftIcon="filter"
            roundness="rounded"
            size="small"
          />

          <FilterTagsGroup
            show={isFiltered}
            dictionary={[
              ...clientTypeOptions,
              ...countryOptions,
              ...riskRatingOptions,
              ...pepOptions,
            ]}
            filters={urlParams}
            onRemove={(k, v) => {
              if (k === 'clear') {
                handleClearFilters(true);
                return;
              }
              handleSetFilters(k, v, true);
            }}
          />
        </Column>
        <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)}>
          <Column gap="lg">
            <Text variant="headline_regular">Filters</Text>
            <Divider />
            <Select
              label="Type"
              placeholder="All"
              options={clientTypeOptions}
              onChange={(v) => handleSetFilters('entityType', v)}
              value={urlParams?.entityType}
            />
            <Select
              label="Country"
              placeholder="All"
              options={countryOptions}
              onChange={(v) => handleSetFilters('country', v)}
              value={urlParams?.country}
              showSearch
            />
            <Select
              label="Risk Rating"
              placeholder="All"
              options={riskRatingOptions}
              onChange={(v) => handleSetFilters('riskRating', v)}
              value={urlParams?.riskRating}
            />
            <Select
              label="PEP"
              placeholder="All"
              options={pepOptions}
              onChange={(v) => handleSetFilters('PEP', v)}
              value={urlParams?.PEP}
              showSearch
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
                onClick={() => handleFilter()}
              />
            </Row>
          </Column>
        </Drawer>

        <TableContainer>
          <Table
            loading={loading}
            columns={columns}
            dataSource={filteredData}
            // rowKey={(r) => r.uuid || r.id}
            key={dataSource.length}
            actionsContainer={(value) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    justifyContent: 'flex-end',
                    gap: 4,
                  }}
                  onClick={() => {
                    onShowMessage({
                      isVisible: true,
                      title: 'Archive Client',
                      description:
                        'Are you sure you want to archive this client?',
                      type: 'question',
                      onConfirm: async () => {
                        await archiveClient(value?.uuid ?? '');
                      },
                    });
                  }}
                >
                  <Text variant="body_sm_bold">Archive</Text>
                  <Icon
                    size="sm"
                    variant="archive"
                    color={theme.textColor.feedback['icon-negative'].value}
                  />
                </div>
              );
            }}
            expandable={{
              expandedRowRender: (data) => {
                return (
                  <TableContainerExpandable>
                    <Table
                      showHeader={false}
                      dataSource={data?.clients ?? []}
                      columns={columnsExpandable}
                      loading={loading}
                      rowKey={(r) => r.uuid}
                      actionsContainer={(value) => {
                        const disabledLogin = !(
                          data.userClients.find(
                            (uc: IUserClient) => uc.client === value.uuid
                          )?.metadata?.role === UserRole.AdminUser &&
                          !!value.account.gateway
                        );

                        return (
                          <ContainerActionDetails>
                            <ButtonActionDetails
                              onClick={() => {
                                router.push(
                                  `/clients/${value.uuid}:${data.uuid}`
                                );
                              }}
                            >
                              <Text variant="body_sm_semibold">Details</Text>
                              <Icon
                                variant="notebook-1"
                                size="sm"
                                color={
                                  theme.backgroundColor.interactive[
                                    'primary-default'
                                  ].value
                                }
                              />
                            </ButtonActionDetails>

                            <ButtonActionDetails
                              style={{
                                cursor: disabledLogin
                                  ? 'not-allowed'
                                  : 'pointer',
                              }}
                              onClick={() => {
                                const businessName =
                                  value?.account?.businessMetadata?.companyName;
                                const individualName = `${value?.account?.individualMetadata?.firstname} ${value?.account?.individualMetadata?.lastname}`;

                                setModalImpersonate({
                                  isVisible: true,
                                  accountName: businessName || individualName,
                                });

                                setImpersonate({
                                  clientUuid: value.uuid,
                                  userUuid: data.uuid,
                                }).catch((err) => {
                                  setModalImpersonate({
                                    isVisible: false,
                                    accountName: '',
                                  });
                                  onShowNotification({
                                    type: 'ERROR',
                                    message:
                                      err?.message ??
                                      'Error on login with user',
                                    description: '',
                                  });
                                });
                              }}
                            >
                              <Text
                                color={
                                  disabledLogin
                                    ? theme.textColor.interactive.disabled.value
                                    : theme.textColor.layout.primary.value
                                }
                                variant="body_sm_semibold"
                              >
                                Login
                              </Text>
                              <Icon
                                size="sm"
                                variant="login-1"
                                color={
                                  disabledLogin
                                    ? theme.textColor.interactive.disabled.value
                                    : theme.textColor.feedback['icon-info']
                                        .value
                                }
                              />
                            </ButtonActionDetails>
                          </ContainerActionDetails>
                        );
                      }}
                    />
                  </TableContainerExpandable>
                );
              },
              rowExpandable: (data) => {
                return data?.clients?.length > 0;
              },
              expandedRowClassName: () => 'expandableTable',
              defaultExpandAllRows: true,
              showExpandColumn: false,
            }}
            pagination={{
              onChangePage: (page, pageSize) => {
                setPagination((prev) => ({
                  ...prev,
                  page,
                  pageSize,
                }));
              },
              totalPage: pagination.total,
              currentPage: pagination.page,
              currentPageSize: pagination.pageSize,
            }}
          />
        </TableContainer>
      </Container>

      <ModalCheckCodeImpersonate
        isVisible={modalImpersonate.isVisible}
        onClose={() =>
          setModalImpersonate((ps) => ({ ...ps, isVisible: false }))
        }
        accountName={modalImpersonate.accountName}
      />
    </>
  );
}

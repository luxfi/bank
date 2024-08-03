'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DateRangeButtons } from '@/components/DateRangeButtons';
import { Divider } from '@/components/Divider';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import Input from '@/components/Input';
import CustomSelect from '@/components/Select';
import SelectCurrencies from '@/components/SelectCurrencyCountry';
import SelectDate from '@/components/SelectDate';
import Table, { IColumnProps, ISorting } from '@/components/Table';

import { UserRole } from '@/models/auth';
import { ITransactionV2 } from '@/models/transactions';

import { useNotification } from '@/context/Notification';

import useColumns from '@/hooks/useColumns';
import useUrlSearchParams from '@/hooks/useUrlParams';
import { useAuth } from '@/store/useAuth';
import { useFilterSelect } from '@/store/useFilterSelect';
import { IFilterSelect } from '@/store/useFilterSelect/types';
import { useTransactions } from '@/store/useTransactions';
import { ITransactionsResponse } from '@/store/useTransactions/types';
import {
  Button,
  Checkbox,
  Column,
  Row,
  Select,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import dayjs from 'dayjs';
import _ from 'underscore';

import { Container } from './styles';
import {
  GatewayOptions,
  ITransactionsFilters,
  ScopeOptions,
  StatusFilterOptions,
  TypeDateFilterOptions,
  TypeFilterOptions,
  transactionColumns,
  transactionColumnsSuperAdmin,
} from './types';

export default function Transactions() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { onShowNotification } = useNotification();
  const { getUsersSelect, getClientsSelect } = useFilterSelect();
  const { id }: { id?: string } = useParams();
  const path = usePathname();

  const [loadingFilters, setLoadingFilters] = useState(false);

  const { loading, errors, getTransactions } = useTransactions();

  const [transactions, setTransactions] = useState<ITransactionsResponse>(
    {} as ITransactionsResponse
  );

  const {
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
    urlParams,
    isFiltered,
  } = useUrlSearchParams<ITransactionsFilters>({
    permanentParams: id
      ? ['client']
      : path.includes('/wallet')
        ? ['currency']
        : [],
  });

  const [cols, setCols] = useState<IColumnProps<ITransactionV2>[]>([]);
  const { checkboxGroup, columns, handleApply, handleToggleColumn } =
    useColumns(cols);

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
  });

  const [sorting, setSorting] = useState<ISorting>({
    orderBy: '',
    order: undefined,
  });

  const [creatorOptions, setCreatorOptions] = useState<
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

  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [openColumns, setOpenColumns] = useState<boolean>(false);

  const getTransactionsList = useCallback(
    async (filters: ITransactionsFilters = urlParams) => {
      applyUrlParams();
      setOpenFilters(false);

      const { page, limit } = pagination;
      const { orderBy, order } = sorting;

      await getTransactions({ ...filters, page, limit, orderBy, order }).then(
        (res) => setTransactions(res)
      );
    },
    [urlParams, applyUrlParams, pagination, sorting, getTransactions]
  );

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: transactions?.pagination?.totalEntries,
    }));
  }, [transactions?.pagination?.totalEntries]);

  const updatedFilters: { [key in keyof ITransactionsFilters]?: string } =
    useMemo(
      () => ({
        ...urlParams,
      }),
      [urlParams]
    );

  const handleSetFilters = (
    type: keyof ITransactionsFilters,
    value?: string,
    fetch?: boolean
  ): void => {
    setUrlSearchParam(type, value);
    updatedFilters[type] = value;
    if (fetch) getTransactionsList(updatedFilters as ITransactionsFilters);
  };

  const handleClearFilters = useCallback(
    (apply?: boolean) => {
      clearUrlSearchParams();

      const query = id ? { client: id } : {};
      if (apply) getTransactionsList(query);
    },
    [clearUrlSearchParams, getTransactionsList, id]
  );

  useEffect(() => {
    const cols =
      currentUser?.role !== UserRole.SuperAdmin
        ? transactionColumns
        : transactionColumnsSuperAdmin;

    setCols(cols);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (errors.getTransactions) {
      onShowNotification({
        type: 'ERROR',
        message: 'Something went wrong',
        description: errors.getTransactions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const getCreatorsOptions = _.debounce(async (creatorName?: string) => {
    if (creatorName && creatorName.length < 3) return;
    setLoadingFilters(true);
    const creators = await getUsersSelect({
      name: creatorName,
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
      .finally(() => setLoadingFilters(false));
    setCreatorOptions(creators);
  }, 500);

  const getClientsOptions = _.debounce(async (clientName?: string) => {
    if (clientName && clientName.length < 3) return;
    setLoadingFilters(true);
    const clients = await getClientsSelect({
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
      .finally(() => setLoadingFilters(false));
    setClientOptions(clients);
  }, 500);

  useEffect(() => {
    getTransactionsList();

    if (currentUser?.role === UserRole.SuperAdmin) {
      getCreatorsOptions();
      getClientsOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, sorting.order, sorting.orderBy, currentUser]);

  const ignoreFilters = useMemo(() => {
    const filters: Array<keyof ITransactionsFilters> = ['beneficiary'];
    if (id) filters.push('client');
    if (path.includes('/wallet')) filters.push('currency');

    return filters;
  }, [id, path]);

  return (
    <Container>
      <Column gap="sm" padding="md">
        {!path.includes('/wallet') && (
          <Text variant="headline_regular">Transactions</Text>
        )}

        <Row gap="sm" width="920px" align="flex-end">
          <Select
            label="Date"
            placeholder="Select date"
            options={TypeDateFilterOptions}
            roundness="rounded"
            value={urlParams.dateField || ''}
            onChange={(value) => {
              handleSetFilters('dateField', value, true);
            }}
          />

          <SelectDate
            disabled={!urlParams.dateField}
            label="Start Date"
            value={urlParams.dateField ? urlParams.startDate : undefined}
            onChange={(value) => {
              handleSetFilters(
                'startDate',
                dayjs(value).format('YYYY-MM-DD'),
                true
              );
            }}
          />
          <SelectDate
            disabled={!urlParams.dateField}
            label="End Date"
            value={urlParams.dateField ? urlParams.endDate : undefined}
            onChange={(value) => {
              handleSetFilters(
                'endDate',
                dayjs(value).format('YYYY-MM-DD'),
                true
              );
            }}
          />
          <DateRangeButtons
            onChange={(e) => {
              handleSetFilters('startDate', e.start);
              handleSetFilters('endDate', e.end, true);
            }}
            value={{
              start: urlParams.startDate || '',
              end: urlParams.endDate || '',
            }}
            disabled={!urlParams.dateField}
          />
        </Row>

        <Row gap="sm">
          <Button
            text="Columns"
            onClick={() => setOpenColumns(true)}
            roundness="rounded"
            variant="secondary"
            size="small"
            leftIcon="checklist"
          />
          <Button
            text="Filters"
            onClick={() => setOpenFilters(true)}
            roundness="rounded"
            size="small"
            leftIcon="filter"
          />
        </Row>
        <Row>
          <FilterTagsGroup
            dictionary={[
              ...StatusFilterOptions,
              ...TypeFilterOptions,
              ...TypeDateFilterOptions,
              ...ScopeOptions,
              ...GatewayOptions,
              ...creatorOptions,
              ...clientOptions,
            ]}
            filtersToIgnore={ignoreFilters}
            show={isFiltered}
            filters={urlParams}
            onRemove={(k, v) => {
              if (k === 'clear') {
                handleClearFilters(true);
                return;
              }
              handleSetFilters(k, v, true);
            }}
          />
        </Row>
      </Column>
      <Drawer open={openFilters} onClose={() => setOpenFilters(false)}>
        <Column gap="sm">
          <Text variant="headline_regular">Filters</Text>
          <Input
            label="Transaction ID"
            placeholder="Transaction ID"
            value={urlParams?.cdaxId}
            onChange={(value) => handleSetFilters('cdaxId', value)}
          />
          <Divider />
          <Row gap="sm">
            <Input
              label="Min"
              placeholder="$150"
              value={urlParams?.minAmount}
              onChange={(value) =>
                handleSetFilters('minAmount', value as string)
              }
            />
            <Input
              label="Max"
              placeholder="$2,000,00"
              value={urlParams?.maxAmount}
              onChange={(value) =>
                handleSetFilters('maxAmount', value as string)
              }
            />
          </Row>
          <Divider />

          <SelectCurrencies
            label="Currency"
            placeholder="All"
            value={urlParams?.currency}
            onChange={(value) => handleSetFilters('currency', value)}
            disabled={path.includes('/wallet')}
          />
          {currentUser?.role === UserRole.SuperAdmin && (
            <>
              <CustomSelect
                label="Creator"
                placeholder="All"
                options={creatorOptions}
                value={urlParams?.creator}
                onChange={(value) => handleSetFilters('creator', value)}
                showSearch
                onSearch={(v) => getCreatorsOptions(v)}
                isLoading={loadingFilters}
              />
              {!id && (
                <CustomSelect
                  label="Client account"
                  placeholder="All"
                  options={clientOptions}
                  value={urlParams?.client}
                  onChange={(value) => handleSetFilters('client', value)}
                  showSearch
                  onSearch={(v) => getClientsOptions(v)}
                  isLoading={loadingFilters}
                />
              )}
            </>
          )}
          <CustomSelect
            label="Status"
            placeholder="All"
            options={StatusFilterOptions}
            value={urlParams?.status}
            onChange={(value) => handleSetFilters('status', value)}
          />

          <CustomSelect
            label="Type"
            placeholder="All"
            options={TypeFilterOptions}
            value={urlParams?.type}
            onChange={(value) => handleSetFilters('type', value)}
          />
          {currentUser?.role === UserRole.SuperAdmin && (
            <>
              <CustomSelect
                label="Gateway"
                placeholder="All"
                options={GatewayOptions}
                value={urlParams?.gateway}
                onChange={(value) => handleSetFilters('client', value)}
              />
            </>
          )}

          <Row gap="sm" justify="flex-end" width="100%">
            <Button
              onClick={() => handleClearFilters()}
              text="Clear"
              roundness="rounded"
              variant="tertiary"
            />
            <Button
              onClick={() => getTransactionsList()}
              text="Apply"
              roundness="rounded"
            />
          </Row>
        </Column>
      </Drawer>
      <Drawer open={openColumns} onClose={() => setOpenColumns(false)}>
        <Column gap="lg">
          <Column>
            <Text variant="headline_regular">Columns</Text>
            <Text
              variant="body_sm_regular"
              color={theme.textColor.layout.secondary.value}
            >
              Define your table columns
            </Text>
          </Column>

          <Column gap="sm" padding="xs">
            {checkboxGroup.map((column) => (
              <Checkbox
                key={column?.key}
                label={column?.label}
                checked={column?.checked}
                onChange={(e: boolean) =>
                  handleToggleColumn(column.key || '', e)
                }
              />
            ))}
          </Column>

          <Row gap="sm" justify="flex-end" width="100%">
            <Button
              variant="tertiary"
              roundness="rounded"
              onClick={() => setOpenColumns(false)}
              text="Cancel"
            />
            <Button
              roundness="rounded"
              onClick={() => {
                handleApply();
                setOpenColumns(false);
              }}
              text="Apply"
            />
          </Row>
        </Column>
      </Drawer>

      <Table
        loading={loading.getTransactions}
        rowKey={(record) => record.id}
        onRowClick={({ id }) => router.push(`/transactions/${id}`)}
        dataSource={transactions.data}
        onSortChange={({ field, sort }) => {
          setSorting({ orderBy: field, order: sort });
        }}
        columns={columns}
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
    </Container>
  );
}

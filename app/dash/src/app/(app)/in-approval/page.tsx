'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DateRangeButtons } from '@/components/DateRangeButtons';
import { Divider } from '@/components/Divider';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import Select from '@/components/Select';
import SelectCurrencies from '@/components/SelectCurrencyCountry';
import SelectDate from '@/components/SelectDate';
import Table, { ISorting } from '@/components/Table';

import { useNotification } from '@/context/Notification';

import { APP_PATHS } from '@/app/paths';
import useUrlSearchParams from '@/hooks/useUrlParams';
import { useFilterSelect } from '@/store/useFilterSelect';
import { useTransactions } from '@/store/useTransactions';
import { ITransactionsResponse } from '@/store/useTransactions/types';
import { Button, Column, Input, Row, Text } from '@cdaxfx/ui';
import dayjs from 'dayjs';
import _ from 'underscore';

import { TypeDateFilterOptions } from '../transactions/types';
import { Container } from './style';
import {
  IInApprovalFilters,
  inApprovalColumns,
  inApprovalStatusOptions,
} from './types';

export default function Pending() {
  const { onShowNotification } = useNotification();
  const router = useRouter();

  const { getBeneficiariesSelect } = useFilterSelect();

  const { getTransactions, loading, errors, setApprovalCount } =
    useTransactions();

  const [loadingFilters, setLoadingFilters] = useState(false);

  const [beneficiariesOptions, setBeneficiariesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [openFilters, setOpenFilters] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<ITransactionsResponse>(
    {} as ITransactionsResponse
  );

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
  } = useUrlSearchParams<IInApprovalFilters>();

  const getInApprovalPayments = useCallback(
    async (updatedFilters: IInApprovalFilters = urlParams) => {
      applyUrlParams();
      setOpenFilters(false);

      const { page, limit } = pagination;
      const { orderBy, order } = sorting;

      const payload = {
        ...updatedFilters,
        page,
        limit,
        orderBy,
        order,
        statusApproval:
          updatedFilters.statusApproval || ('pending,rejected,expired' as any),
        type: 'payment',
      };

      if (updatedFilters.startDate || updatedFilters.endDate) {
        payload.dateField = 'createdAt';
      } else {
        payload.dateField = undefined;
      }

      await getTransactions(payload).then((res) => {
        setTransactions(res);
      });
    },
    [urlParams, applyUrlParams, pagination, sorting, getTransactions]
  );

  useEffect(() => {
    setApprovalCount();
  }, [setApprovalCount]);

  const getBeneficiariesList = _.debounce(async (beneficiaryName?: string) => {
    if (beneficiaryName && beneficiaryName.length < 3) return;
    setLoadingFilters(true);
    const options = await getBeneficiariesSelect({
      name: beneficiaryName,
      limit: 10,
      page: 1,
    })
      .then((res) => {
        return res.map((b) => ({
          label: b.name,
          value: b.id,
        }));
      })
      .finally(() => setLoadingFilters(false));

    setBeneficiariesOptions(options);
  }, 500);

  const updatedFilters: { [key in keyof IInApprovalFilters]?: string } =
    useMemo(
      () => ({
        ...urlParams,
      }),
      [urlParams]
    );

  const handleSetFilters = useCallback(
    (type: keyof IInApprovalFilters, value?: string, fetch?: boolean): void => {
      setUrlSearchParam(type, value);

      updatedFilters[type] = value;
      if (fetch) getInApprovalPayments(updatedFilters as IInApprovalFilters);
    },
    [getInApprovalPayments, setUrlSearchParam, updatedFilters]
  );

  const handleClearFilters = useCallback(
    (apply?: boolean) => {
      clearUrlSearchParams();

      if (apply) getInApprovalPayments({} as IInApprovalFilters);
    },
    [clearUrlSearchParams, getInApprovalPayments]
  );

  useEffect(() => {
    getInApprovalPayments();
    getBeneficiariesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, sorting.order, sorting.orderBy]);

  useEffect(() => {
    if (errors.getTransactions) {
      onShowNotification({
        type: 'ERROR',
        description: 'Error loading payments',
        message: errors.getTransactions,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors.getTransactions]);

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: transactions?.pagination?.totalEntries,
    }));
  }, [transactions?.pagination?.totalEntries]);

  return (
    <Container>
      <Column gap="sm" padding="md">
        <Text variant="headline_regular">In Approval</Text>

        <Row gap="sm" width="920px" align="flex-end">
          <SelectDate
            label="Start Date"
            value={urlParams.startDate}
            disabledDate={(date) => {
              if (date > dayjs(new Date())) return true;
              if (date > dayjs(urlParams.endDate)) return true;
              return false;
            }}
            onChange={(e) => {
              handleSetFilters(
                'startDate',
                dayjs(e).format('YYYY-MM-DD'),
                true
              );
            }}
          />
          <SelectDate
            label="End Date"
            disabledDate={(date) => {
              if (date > dayjs(new Date())) return true;
              if (date < dayjs(urlParams.startDate)) return true;
              return false;
            }}
            value={urlParams.endDate}
            onChange={(e) => {
              handleSetFilters('endDate', dayjs(e).format('YYYY-MM-DD'), true);
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
          />
        </Row>

        <Row gap="sm">
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
              ...inApprovalStatusOptions,
              ...beneficiariesOptions,
              ...TypeDateFilterOptions,
            ]}
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
        <Column gap="lg">
          <Text variant="headline_regular">Filters</Text>

          <Input
            label="Transaction ID"
            placeholder="Transaction ID"
            leadingIcon="magnifer"
            roundness="rounded"
            value={urlParams?.cdaxId}
            onChangeText={(value) => handleSetFilters('cdaxId', value)}
          />

          <Divider />
          <Row gap="sm">
            <Input
              label="Min Amount"
              roundness="rounded"
              placeholder="$150"
              mask="$000,000,000.00"
              value={urlParams.minAmount}
              onChangeText={(e) => handleSetFilters('minAmount', String(e))}
            />
            <Input
              label="Max Amount"
              roundness="rounded"
              placeholder="$2,000,00"
              mask="$000,000,000.00"
              value={urlParams.maxAmount}
              onChangeText={(e) => handleSetFilters('maxAmount', String(e))}
            />
          </Row>
          <Divider />

          <SelectCurrencies
            label="Currency"
            value={urlParams?.currency}
            onChange={(value) => handleSetFilters('currency', value)}
            placeholder="All"
          />

          <Select
            label="Beneficiary"
            options={beneficiariesOptions}
            placeholder="All"
            value={urlParams?.beneficiary}
            onChange={(value) => handleSetFilters('beneficiary', value)}
            showSearch
            onSearch={(value) => getBeneficiariesList(value)}
            isLoading={loadingFilters}
          />
          <Select
            label="Status"
            placeholder="All"
            options={inApprovalStatusOptions}
            value={urlParams?.statusApproval}
            onChange={(value) => handleSetFilters('statusApproval', value)}
          />

          <Row gap="sm" justify="flex-end" width="100%">
            <Button
              text="Clear"
              roundness="rounded"
              variant="tertiary"
              onClick={() => handleClearFilters()}
            />
            <Button
              text="Apply"
              roundness="rounded"
              onClick={() => {
                setOpenFilters(false);
                getInApprovalPayments();
              }}
            />
          </Row>
        </Column>
      </Drawer>

      <Table
        loading={loading.getTransactions}
        columns={inApprovalColumns}
        dataSource={transactions.data}
        rowKey={(record) => record.id}
        onRowClick={(e) => router.push(APP_PATHS.IN_APPROVAL.DETAIL(e.id))}
        onSortChange={({ field, sort }) => {
          setSorting({ orderBy: field, order: sort });
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
      />
    </Container>
  );
}

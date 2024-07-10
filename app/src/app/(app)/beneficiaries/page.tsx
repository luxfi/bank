'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import ModalMessage from '@/components/ModalMessage'; // Changed to default import
import ModalResult from '@/components/ModalResult';
import Select from '@/components/Select';
import Table from '@/components/Table'; // Assuming Table is a default export

import { UserRole } from '@/models/auth';
import { IBeneficiaryListResponse } from '@/models/beneficiaries'; // Assuming the file is named 'beneficiary' not 'beneficiaries'

import { useNotification } from '@/context/Notification';

import useUrlSearchParams from '@/hooks/useUrlParams';
import { useAuth } from '@/store/useAuth';
import { useBeneficiaries } from '@/store/useBeneficiaries';
import { useCurrenciesAndCountries } from '@/store/useCurrenciesAndCountries';
import { Button, Column, Row, useTheme } from '@cdaxfx/ui';

import { approveBeneficiary, disapproveBeneficiary } from '@/api/beneficiaries';

import {
  Container,
  DrawerContainer,
  ErrorModalFooter,
  FiltersAction,
  FiltersContent,
  MainContent,
  Title,
  TitleFilters,
  TitleFiltersContainer,
} from './styles';

export default function Beneficiaries() {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { countries, currenciesCountries } = useCurrenciesAndCountries();
  const { getBeneficiaries } = useBeneficiaries();
  const { onShowNotification } = useNotification();
  const router = useRouter();
  const { id } = useParams();

  const {
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
    urlParams,
    isFiltered,
  } = useUrlSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 10, page: 1 });
  const [sorting, setSorting] = useState({ orderBy: '', order: undefined });

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setIsLoading(true);
      try {
        const response = await getBeneficiaries({ ...urlParams, page: pagination.page, limit: pagination.limit, orderBy: sorting.orderBy, order: sorting.order });
        setDataSource(response);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBeneficiaries();
  }, [pagination.page, sorting.orderBy, sorting.order, urlParams, getBeneficiaries]);

  const handleApprove = useCallback(async (id, name) => {
    setIsLoading(true);
    try {
      await approveBeneficiary(id);
      onShowNotification({
        type: 'success',
        message: `The beneficiary ${name} has been approved.`
      });
      await fetchBeneficiaries();
    } catch (error) {
      onShowNotification({
        type: 'error',
        message: 'Approval failed',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [getBeneficiaries, onShowNotification]);

  const actionsColumn = (data) => (
    <Row gap="xxs">
      <ButtonWithIcon
        label="Pay"
        icon="wallet-money"
        disabled={data.status !== 'approved'}
        iconColor={theme.textColor.feedback['icon-positive'].value}
        onClick={() => router.push(`/create-payment?beneficiary=${data.id}&currency=${data.currency}`)}
      />
      <ButtonWithIcon
        label="View"
        icon="eye"
        disabled={data.status !== 'approved'}
        iconColor={theme.textColor.feedback['icon-info'].value}
        onClick={() => router.push(`/beneficiaries/${data.id}`)}
      />
    </Row>
  );

  return (
    <Container>
      <Row justify="space-between" padding="sm">
        <Title>Beneficiaries</Title>
        <Button
          text="Add Beneficiary"
          leftIcon="plus1"
          roundness="rounded"
          onClick={() => router.push('/beneficiaries/new')}
        />
      </Row>
      <MainContent>
        <Table
          columns={columns(currentUser?.role)}
          dataSource={dataSource}
          loading={isLoading}
          actionsContainer={actionsColumn}
          rowKey={(r) => r.id}
          pagination={{
            onChangePage: (page) => setPagination(prev => ({ ...prev, page })),
            totalPage: pagination.total,
            currentPage: pagination.page,
            currentPageSize: pagination.limit,
          }}
          onSortChange={(sort) => setSorting(sort)}
        />
      </MainContent>
      <Drawer open={showFilters} onClose={() => setShowFilters(false)}>
        <DrawerContainer>
          <TitleFiltersContainer>
            <TitleFilters>Filters</TitleFilters>
          </TitleFiltersContainer>
          <FiltersContent>
            {/* Additional filter components */}
          </FiltersContent>
        </DrawerContainer>
      </Drawer>
      {/* Modals and other components */}
    </Container>
  );
}

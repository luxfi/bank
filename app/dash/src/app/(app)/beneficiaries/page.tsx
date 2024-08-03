'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import { Drawer } from '@/components/Drawer';
import { FilterTagsGroup } from '@/components/FilterTagsGroup';
import ModalMessage from '@/components/ModalMessage';
import ModalResult from '@/components/ModalResult';
import Select from '@/components/Select';
import Table, { ISorting } from '@/components/Table';

import { UserRole } from '@/models/auth';
import { IBeneficiaryListResponse } from '@/models/beneficiaries';

import { useNotification } from '@/context/Notification';

import useUrlSearchParams from '@/hooks/useUrlParams';
import { useAuth } from '@/store/useAuth';
import { useBeneficiaries } from '@/store/useBeneficiaries';
import { IBeneficiariesResponse } from '@/store/useBeneficiaries/types';
import { useCurrenciesAndCountries } from '@/store/useCurrenciesAndCountries';
import { useFilterSelect } from '@/store/useFilterSelect';
import { IFilterSelect } from '@/store/useFilterSelect/types';
import { Button, Column, Row, useTheme } from '@luxbank/ui';
import { DefaultOptionType } from 'antd/es/select';
import _ from 'underscore';

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
import {
  IBeneficiariesFilters,
  beneficiariesStatusOptions,
  columns,
} from './type';

interface IConfirmModalProps {
  isVisible: boolean;
  name?: string;
  id?: string;
  isLoading?: boolean;
}

export default function Beneficiaries() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { countries, currencieCountries } = useCurrenciesAndCountries();
  const { onShowNotification } = useNotification();

  const [loadingFilters, setLoadingFilters] = useState(false);

  const { getBeneficiariesSelect, getClientsSelect } = useFilterSelect();

  const router = useRouter();

  const { id }: { id?: string } = useParams();

  const {
    applyUrlParams,
    setUrlSearchParam,
    clearUrlSearchParams,
    urlParams,
    isFiltered,
  } = useUrlSearchParams<IBeneficiariesFilters>({
    permanentParams: id ? ['client', 'account'] : [],
  });

  const { getBeneficiaries } = useBeneficiaries();

  const [unapproveModalProps, setUnapproveModalProps] =
    useState<IConfirmModalProps>({ isVisible: false });
  const [approveModalProps, setApproveModalProps] =
    useState<IConfirmModalProps>({ isVisible: false });

  const [successModalProps, setSuccessModalProps] = useState<{
    isVisible: boolean;
    title: string;
  }>({
    isVisible: false,
    title: '',
  });
  const [approveErrorModalProps, setApproveErrorModalProps] = useState<{
    isVisible: boolean;
    title: string;
    id: string;
    description: string;
  }>({
    isVisible: false,
    title: '',
    id: '',
    description: '',
  });

  const [beneficiariesOptions, setBeneficiariesOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [clientOptions, setClientOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<IBeneficiariesResponse>(
    {} as IBeneficiariesResponse
  );
  const [dataFilters, setDataFilters] = useState<{
    name: Array<string>;
    currencies: Array<{ code: string; name: string }>;
    countries: Array<{ code: string; name: string }>;
  }>({
    name: [],
    currencies: [],
    countries: [],
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

  const handleSetFilters = (
    type: keyof IBeneficiariesFilters,
    value?: string,
    fetch?: boolean
  ): void => {
    setUrlSearchParam(type, value);

    const updatedFilters = {
      ...urlParams,
      [type]: value,
    };

    if (fetch) getBeneficiariesList(updatedFilters as IBeneficiariesFilters);
  };

  const getBeneficiariesList = useCallback(
    async (filters: IBeneficiariesFilters = urlParams) => {
      setIsLoading(true);
      applyUrlParams();
      setShowFilters(false);

      const { page, limit } = pagination;
      const { orderBy, order } = sorting;

      await getBeneficiaries({ ...filters, page, limit, orderBy, order })
        .then((response) => {
          setDataSource(response);
        })
        .finally(() => setIsLoading(false));
    },
    [applyUrlParams, getBeneficiaries, pagination, sorting, urlParams]
  );

  const handleClearFilters = useCallback(
    (apply?: boolean) => {
      clearUrlSearchParams();

      const query = id ? { client: id } : {};
      if (apply) getBeneficiariesList(query as IBeneficiariesFilters);
    },
    [clearUrlSearchParams, getBeneficiariesList, id]
  );

  const actionsColumn = (data: IBeneficiaryListResponse) => {
    const isNotViewerUser = currentUser?.role !== UserRole.ViewerUser;
    const isSuperAdmin = currentUser?.role === UserRole.SuperAdmin;
    const isApproved = data.status === 'approved';

    return (
      <>
        <Row gap="xxs">
          {isNotViewerUser && !isSuperAdmin && (
            <ButtonWithIcon
              label="Pay"
              icon="wallet-money"
              disabled={!isApproved}
              iconColor={theme.textColor.feedback['icon-positive'].value}
              onClick={() =>
                router.push(
                  `/create-payment?beneficiary=${data.id}&currency=${data.currency}`
                )
              }
            />
          )}

          {!isSuperAdmin && (
            <ButtonWithIcon
              label="View"
              icon="eye"
              disabled={data.status !== 'approved'}
              iconColor={theme.textColor.feedback['icon-info'].value}
              onClick={() => router.push(`/beneficiaries/${data.id}`)}
            />
          )}

          {isSuperAdmin && (
            <>
              <ButtonWithIcon
                label="Details"
                icon="notebook-1"
                iconColor={theme.borderColor.interactive.primary.value}
                onClick={() => router.push(`/beneficiaries/${data.id}`)}
              />

              <Column align="flex-end" width="140px">
                <ButtonWithIcon
                  label={isApproved ? 'Unapprove' : 'Approve'}
                  icon={isApproved ? 'cross' : 'arrow-to-top-left'}
                  iconColor={
                    isApproved
                      ? theme.textColor.feedback['icon-negative'].value
                      : theme.textColor.feedback['icon-positive'].value
                  }
                  onClick={() => {
                    if (isApproved) {
                      return setUnapproveModalProps({
                        isVisible: true,
                        name: data.name,
                        id: data.id,
                      });
                    }

                    return setApproveModalProps({
                      isVisible: true,
                      name: data.name,
                      id: data.id,
                    });
                  }}
                />
              </Column>
            </>
          )}
        </Row>
      </>
    );
  };

  useEffect(() => {
    getBeneficiariesList();
    getBeneficiariesOptions();

    if (currentUser?.role === UserRole.SuperAdmin) {
      getClientsOptions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, pagination.page, sorting.order, sorting.orderBy]);

  useEffect(() => {
    setDataFilters((pS) => ({
      ...pS,
      countries: countries,
      currencies: currencieCountries,
    }));
  }, [countries, currencieCountries]);

  const selectOptionsCurrencies = useMemo((): Array<DefaultOptionType> => {
    return dataFilters.currencies
      .map((b) => ({
        label: b.code,
        value: b.code,
      }))
      .filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.value === obj.value)
      );
  }, [dataFilters.currencies]);

  const selectOptionsBankAccount = useMemo((): Array<DefaultOptionType> => {
    return dataFilters.countries
      .map((b) => ({
        label: b.name,
        value: b.code,
      }))
      .filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.value === obj.value)
      );
  }, [dataFilters.countries]);

  const dismissSuccessModal = useCallback(() => {
    setSuccessModalProps({
      isVisible: false,
      title: '',
    });
  }, []);

  const dismissApproveErrorModal = useCallback(() => {
    setApproveErrorModalProps({
      isVisible: false,
      title: '',
      id: '',
      description: '',
    });
  }, []);

  const dismissApproveModal = useCallback(() => {
    setApproveModalProps({
      isVisible: false,
      name: '',
      id: '',
      isLoading: false,
    });
  }, []);

  const dismissUnapproveModal = useCallback(() => {
    setUnapproveModalProps({
      isVisible: false,
      name: '',
      id: '',
      isLoading: false,
    });
  }, []);

  const handleApprove = useCallback(async () => {
    try {
      setApproveModalProps((prev) => ({ ...prev, isLoading: true }));

      await approveBeneficiary(approveModalProps.id!);

      await getBeneficiariesList();

      setSuccessModalProps({
        isVisible: true,
        title: `The beneficiary ${approveModalProps.name} has been approved.`,
      });
    } catch (error: any) {
      setApproveErrorModalProps({
        isVisible: true,
        id: approveModalProps.id!,
        title: 'Approval for beneficiary not granted.',
        description: error?.message,
      });
    } finally {
      dismissApproveModal();
    }
  }, [
    approveModalProps.id,
    approveModalProps.name,
    dismissApproveModal,
    getBeneficiariesList,
  ]);

  const handleUnapprove = useCallback(async () => {
    try {
      setUnapproveModalProps((prev) => ({ ...prev, isLoading: true }));

      await disapproveBeneficiary(unapproveModalProps.id!);

      await getBeneficiariesList();

      setSuccessModalProps({
        isVisible: true,
        title: `The beneficiary ${approveModalProps.name} has been unapproved.`,
      });
    } catch (error) {
      console.error(error);
      onShowNotification({
        type: 'ERROR',
        message: 'Unable to unapprove beneficiary',
        description: '',
      });
    } finally {
      dismissUnapproveModal();
    }
  }, [
    unapproveModalProps.id,
    getBeneficiariesList,
    approveModalProps.name,
    onShowNotification,
    dismissUnapproveModal,
  ]);

  useEffect(() => {
    setPagination((p) => ({
      ...p,
      total: dataSource?.pagination?.totalEntries,
    }));
  }, [dataSource?.pagination?.totalEntries]);

  const getBeneficiariesOptions = _.debounce(
    async (beneficiaryName?: string) => {
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
    },
    500
  );

  const getClientsOptions = _.debounce(async (clientName?: string) => {
    if (clientName && clientName?.length < 3) return;
    setLoadingFilters(true);
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
      .finally(() => setLoadingFilters(false));
    setClientOptions(clientOptions);
  }, 500);

  const navigateToEditPostError = useCallback(() => {
    router.push(`/beneficiaries/new?id=${approveErrorModalProps?.id}`);
  }, [approveErrorModalProps.id, router]);

  return (
    <>
      <Container>
        <Row justify="space-between" padding="sm">
          <Title>Beneficiaries</Title>
          {!id && currentUser?.role !== UserRole.ViewerUser && (
            <Button
              text="Add Beneficiary"
              leftIcon="plus1"
              roundness="rounded"
              onClick={() => router.push('/beneficiaries/new')}
            />
          )}
        </Row>
        <Column gap="sm" padding="sm">
          <Button
            onClick={() => setShowFilters(true)}
            text="Filters"
            leftIcon="filter"
            roundness="rounded"
            size="small"
          />

          <FilterTagsGroup
            show={isFiltered}
            dictionary={[
              ...clientOptions,
              ...beneficiariesOptions,
              ...beneficiariesStatusOptions,
              ...selectOptionsBankAccount.map((b) => ({
                label: b.label ? String(b.label) : '',
                value: b.value ? String(b.value) : '',
              })),
            ]}
            filtersToIgnore={id ? ['client', 'account'] : []}
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
        <MainContent>
          <Table
            columns={columns(currentUser?.role)}
            dataSource={dataSource.data}
            loading={isLoading}
            actionsContainer={(data: any) => actionsColumn(data)}
            rowKey={(r) => r.uuid || r.id}
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
        </MainContent>
      </Container>

      <Drawer open={showFilters} onClose={() => setShowFilters(false)}>
        <DrawerContainer>
          <TitleFiltersContainer>
            <TitleFilters>Filters</TitleFilters>
          </TitleFiltersContainer>

          <FiltersContent>
            {currentUser?.role === UserRole.SuperAdmin && !id && (
              <Select
                label="Client "
                placeholder="All"
                onChange={(v) => handleSetFilters('client', v)}
                value={urlParams?.client}
                options={clientOptions}
                showSearch
                onSearch={(v) => getClientsOptions(v)}
                isLoading={loadingFilters}
              />
            )}
            <Select
              label="Beneficiary"
              placeholder="All"
              options={beneficiariesOptions}
              value={urlParams.beneficiary}
              onChange={(value) => handleSetFilters('beneficiary', value)}
              showSearch
              onSearch={getBeneficiariesOptions}
              isLoading={loadingFilters}
            />
            <Select
              label="Currency"
              placeholder="All"
              options={selectOptionsCurrencies}
              value={urlParams.currency}
              onChange={(value) => handleSetFilters('currency', value)}
              showSearch
            />
            <Select
              label="Bank Country"
              placeholder="All"
              options={selectOptionsBankAccount}
              value={urlParams.bankCountry}
              onChange={(value) => handleSetFilters('bankCountry', value)}
              showSearch
            />
            <Select
              label="Status"
              placeholder="All"
              options={beneficiariesStatusOptions}
              value={urlParams.status}
              onChange={(value) => handleSetFilters('status', value)}
            />

            <FiltersAction>
              <Button
                onClick={() => {
                  handleClearFilters();
                }}
                roundness="rounded"
                variant="tertiary"
                text="Clear"
              />
              <Button
                onClick={() => getBeneficiariesList()}
                roundness="rounded"
                text="Apply"
              />
            </FiltersAction>
          </FiltersContent>
        </DrawerContainer>
      </Drawer>

      <ModalMessage
        isVisible={unapproveModalProps.isVisible}
        title={`Would you like to unapprove this beneficiary, ${unapproveModalProps.name}?`}
        description=""
        isLoading={unapproveModalProps.isLoading}
        onConfirm={handleUnapprove}
        onCancel={dismissUnapproveModal}
      />

      <ModalMessage
        isVisible={approveModalProps.isVisible}
        title={`Would you like to submit this beneficiary, ${approveModalProps.name}, for approval?`}
        description=""
        isLoading={approveModalProps.isLoading}
        onConfirm={handleApprove}
        onCancel={dismissApproveModal}
      />

      <ModalResult
        isVisible={successModalProps.isVisible}
        onCancel={dismissSuccessModal}
        title={successModalProps.title}
        subtitle=""
        type="SUCCESS"
      />

      <ModalResult
        isVisible={approveErrorModalProps.isVisible}
        onCancel={dismissApproveErrorModal}
        title={approveErrorModalProps.title}
        subtitle={approveErrorModalProps.description}
        footer={() => (
          <ErrorModalFooter>
            <Button
              text="Edit for resubmit"
              style={{ alignSelf: 'center' }}
              roundness="rounded"
              onClick={navigateToEditPostError}
            />
          </ErrorModalFooter>
        )}
        type="FAIL"
      />
    </>
  );
}

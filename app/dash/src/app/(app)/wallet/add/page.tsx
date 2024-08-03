'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import Input from '@/components/Input';
import Table from '@/components/Table';

import { ICurrencies } from '@/models/currencies';

import { useWallet } from '@/store/useWallet';
import { IWallet } from '@/store/useWallet/types';
import { Button, Row, useTheme } from '@luxbank/ui';

import {
  Container,
  FilterContainer,
  LabelBackButton,
  MainContent,
  Title,
} from './styles';
import { columns } from './types';

export default function AddWallet() {
  const { theme } = useTheme();
  const router = useRouter();
  const { getWalletsCurrencies, clearWallets } = useWallet();

  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState<string>('');
  const [dataSource, setDataSource] = useState<Array<IWallet>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCurrencies = async () => {
    setIsLoading(true);
    const response = await getWalletsCurrencies();
    setIsLoading(false);
    setDataSource(response);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const dataSourceFiltered = useMemo(() => {
    return dataSource.filter(
      (data) =>
        data.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        data.currency.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  }, [search, dataSource]);

  const actionsColumn = (data: ICurrencies) => {
    return (
      <Row gap="xxs">
        <ButtonWithIcon
          label="Add"
          icon="alt-arrow-right"
          iconColor={theme.backgroundColor.interactive['primary-default'].value}
          onClick={() => {
            clearWallets();

            router.push(`/wallet/details?&currency=${data.currency}`);
          }}
        />
      </Row>
    );
  };

  return (
    <Container>
      <BackButton>
        <LabelBackButton>Wallet</LabelBackButton>
      </BackButton>
      <div style={{ alignSelf: 'center', width: 900 }}>
        <Title>{`Get accounts in more than 30 currencies. `}</Title>
        <Title
          style={{ marginBottom: 16 }}
        >{`Local account details are available in EUR, GBP and USD. `}</Title>
        <FilterContainer>
          <Input
            label=""
            placeholder="Find a currency"
            value={search}
            onChange={setSearch}
          />
          <div>
            <Button
              variant="secondary"
              roundness="rounded"
              text=""
              size="default"
              leftIcon="magnifer"
            />
          </div>
        </FilterContainer>
        <MainContent>
          <Table
            columns={columns()}
            dataSource={dataSourceFiltered}
            loading={isLoading}
            actionsContainer={(data: any) => actionsColumn(data)}
            rowKey={(r) => r.uuid || r.id}
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
        </MainContent>
      </div>
    </Container>
  );
}

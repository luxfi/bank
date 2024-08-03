'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ButtonWithIcon } from '@/components/ButtonWithIcon';
import Table from '@/components/Table';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { useWallet } from '@/store/useWallet';
import { IWallet } from '@/store/useWallet/types';
import { Button, Input, Row, useTheme } from '@cdaxfx/ui';

import { Container, HeaderContainer, MainContent, Title } from './styles';
import { columns } from './types';

export default function Wallet() {
  const { theme } = useTheme();
  const router = useRouter();
  const { getWallets, isLoading, clearWallets } = useWallet();
  const { currentUser } = useAuth();

  const [dataSource, setDataSource] = useState<Array<IWallet>>([]);
  const [filteredData, setFilteredData] = useState<Array<IWallet>>([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchWallets = async () => {
    const response = await getWallets({});
    if (Array.isArray(response)) {
      setDataSource(response);
      setFilteredData(response);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleFilterWallets = (search: string) => {
    const filtered = dataSource.filter((d) => {
      const byName = d.name.toLowerCase().includes(search.toLowerCase());
      const byCurrency = d.currency
        .toLowerCase()
        .includes(search.toLowerCase());

      return byName || byCurrency;
    });
    setFilteredData(filtered);
  };

  const actionsColumn = (data: any) => {
    return (
      <Row gap="xxs">
        <ButtonWithIcon
          label="View"
          icon="eye"
          iconColor={theme.textColor.feedback['icon-info'].value}
          onClick={() => {
            clearWallets();

            router.push(`/wallet/details?currency=${data.currency}`);
          }}
        />
      </Row>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Wallets</Title>
        {currentUser?.role !== UserRole.ViewerUser && (
          <Button
            text="Add a currency"
            leftIcon="dollar-minimalistic"
            roundness="rounded"
            onClick={() => router.push('/wallet/add')}
          />
        )}
      </HeaderContainer>

      <Row width="400px" align="center" gap="xxxs" style={{ marginBottom: 16 }}>
        <Input
          roundness="rounded"
          leadingIcon="magnifer"
          placeholder="Find a currency"
          onChangeText={(e) => handleFilterWallets(e)}
        />
      </Row>
      <MainContent>
        <Table
          columns={columns()}
          dataSource={filteredData}
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
    </Container>
  );
}

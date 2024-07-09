'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { CardButton } from '@/components/CardButton';
import { ModalCheckCodeImpersonate } from '@/components/ModaCodeImpersonate';
import Table from '@/components/Table';
import { Tooltip } from '@/components/Tooltip';

import { UserRole } from '@/models/auth';
import { ITransactionV2 } from '@/models/transactions';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { useClients } from '@/store/useClient';
import { Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';

import { getTransactions } from '@/api/transactions';

import { Currencies } from './components/Currencies';
import { OverviewDashboardCards } from './components/OverviewCardsDashboard';
import { ActionButton } from './styles';
import { SuperAdminCards } from './SuperAdminCards';
import { clientsColumns, transactionsColumns } from './types';

export default function Dashboard() {
  const router = useRouter();
  const { currentUser, setImpersonate } = useAuth();
  const { theme } = useTheme();
  const { onShowNotification } = useNotification();

  const { getRiskAssessments } = useClients();

  const [isLoading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
  });

  const [transactions, setTransactions] = useState<Array<ITransactionV2>>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [modalImpersonate, setModalImpersonate] = useState({
    isVisible: false,
    accountName: '',
  });

  const [riskAssessmentCount, setRiskAssessmentCount] = useState(0);

  const getTransactionsList = useCallback(async () => {
    setLoading(true);

    await getTransactions({
      limit: 6,
      page: 1,
      orderBy: 'updatedAt',
      order: 'desc',
    })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        }
      })
      .catch((err) => {
        console.log(err, 'e');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRiskAssessmentList = useCallback(async () => {
    setLoading(true);

    const { page, limit } = pagination;

    await getRiskAssessments({ page, limit })
      .then((res) => {
        setClients(res.data);
        setRiskAssessmentCount(res.pagination.totalEntries);
      })
      .catch((err) => {
        console.log(err, 'e');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getRiskAssessments, pagination]);

  useEffect(() => {
    setPagination((p) => ({ ...p, total: riskAssessmentCount }));
  }, [riskAssessmentCount]);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser?.role === 'admin:super') {
      getRiskAssessmentList();
    } else {
      getTransactionsList();
    }
  }, [currentUser, getRiskAssessmentList, getTransactionsList]);

  return (
    <>
      <Column width="100%">
        {currentUser?.role === 'admin:super' ? (
          <>
            <SuperAdminCards />

            <Row gap="sm" align="center" style={{ marginBottom: '16px' }}>
              <Row gap="xxxs" align="center">
                <Text variant="headline_semibold">New clients accounts</Text>
                <Tooltip
                  title="List of the last 10 clients accounts created. To view all clients accounts, please navigate to the client section."
                  placement="bottomLeft"
                  width="520px"
                >
                  <>
                    <Icon variant="exclamation-circle" size="sm" />
                  </>
                </Tooltip>
              </Row>
              <Text
                variant="callout_regular"
                color={theme.textColor.layout.secondary.value}
              >
                In the last 30 days, was reached the peak of
              </Text>
              <Text variant="headline_bold">
                <CountUp
                  style={{ color: theme.textColor.layout.primary.value }}
                  start={0}
                  end={riskAssessmentCount}
                  decimal="."
                  className="count"
                />
              </Text>
              <Text variant="headline_semibold">new clients accounts</Text>
            </Row>
          </>
        ) : (
          <>
            <Text variant="headline_regular">Currencies</Text>

            <Currencies />

            {currentUser?.role !== UserRole.ViewerUser && (
              <Row style={{ width: '100%', gap: 16, marginTop: 16 }}>
                <CardButton
                  onClick={() => {
                    router.push(`/beneficiaries/new`);
                  }}
                  icon="user-plus"
                  label="Add a beneficiary"
                  description="Set a new beneficiary to pay"
                />
                <CardButton
                  onClick={() => {
                    router.push(`/create-payment`);
                  }}
                  icon="hand-money"
                  label="Create a payment"
                  description="Make a new payment"
                />
                <CardButton
                  onClick={() => {
                    router.push(`/conversion`);
                  }}
                  icon="sort-vertical"
                  label="Make a conversion"
                  description="Set up new beneficiary to pay"
                />
              </Row>
            )}

            <OverviewDashboardCards />

            <Text style={{ marginTop: 32 }} variant="headline_regular">
              Recent Transactions
            </Text>
          </>
        )}

        <Table
          containerStyles={{ width: '100%' }}
          loading={isLoading}
          columns={
            currentUser?.role === 'admin:super'
              ? clientsColumns
              : transactionsColumns
          }
          dataSource={
            currentUser?.role === 'admin:super' ? clients : transactions
          }
          actionsContainer={(value) => {
            return (
              currentUser?.role === 'admin:super' && (
                <Row gap="xxl">
                  <ActionButton
                    onClick={() =>
                      router.push(`/clients/${value.id}:${value.userId}`)
                    }
                  >
                    <Text variant="body_sm_semibold">Details</Text>
                    <Icon
                      size="sm"
                      variant="notebook-1"
                      color={
                        theme.backgroundColor.interactive['primary-default']
                          .value
                      }
                    />
                  </ActionButton>
                  <ActionButton
                    style={{
                      cursor: value?.canImpersonate ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                      setModalImpersonate({
                        isVisible: true,
                        accountName: value.name,
                      });

                      setImpersonate({
                        clientUuid: value.id,
                        userUuid: value.userId,
                      }).catch((err) => {
                        setModalImpersonate({
                          isVisible: false,
                          accountName: '',
                        });
                        onShowNotification({
                          type: 'ERROR',
                          message: err?.message ?? 'Error on login with user',
                          description: '',
                        });
                      });
                    }}
                  >
                    <Text
                      color={
                        value?.canImpersonate
                          ? theme.textColor.layout.primary.value
                          : theme.textColor.interactive.disabled.value
                      }
                      variant="body_sm_semibold"
                    >
                      Login
                    </Text>
                    <Icon
                      size="sm"
                      variant="login-1"
                      color={
                        value?.canImpersonate
                          ? theme.textColor.feedback['icon-info'].value
                          : theme.textColor.interactive.disabled.value
                      }
                    />
                  </ActionButton>
                </Row>
              )
            );
          }}
          rowKey={(record) => record.id}
          onRowClick={(row) => {
            if (currentUser?.role === 'admin:super') return;
            router.push(`/transactions/${row.id}`);
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
      </Column>

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

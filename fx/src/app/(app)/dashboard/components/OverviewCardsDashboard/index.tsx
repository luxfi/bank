import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { useDashboard } from '@/store/useDashboard';
import { IUserDashboardInfo } from '@/store/useDashboard/types';
import { Column, Row, Text, useTheme } from '@cdaxfx/ui';
import dayjs from 'dayjs';

import { CardStatus } from '../CardStatus';
import { CardTotal } from '../CardTotal';
import { Container } from './styles';

export const OverviewDashboardCards: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { getUserDashboardInfo } = useDashboard();
  const { currentUser } = useAuth();

  const [data, setData] = useState<IUserDashboardInfo>({
    expiredApproval: 0,
    transactions: 0,
    pendingApproval: 0,
    awaitingFunds: 0,
    failedPayments: 0,
    rejectedPayments: 0,
    completedConversions: 0,
    completedPayments: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    lastThirtyDaysTransactions: 0,
  });

  const today = useMemo(() => {
    return dayjs().format('YYYY-MM-DD');
  }, []);

  const fetchDashboardInfo = useCallback(async () => {
    if (currentUser?.role === UserRole.SuperAdmin) return;
    const dashboardInfo = await getUserDashboardInfo();
    setData(dashboardInfo);
  }, [getUserDashboardInfo, currentUser]);

  useEffect(() => {
    fetchDashboardInfo();
  }, [fetchDashboardInfo]);

  return (
    <>
      <Row style={{ gap: 8, marginTop: 32 }} align="center">
        <Text variant="headline_regular">Overall Overview</Text>
        <Text
          color={theme.textColor.layout.secondary.value}
          style={{ marginLeft: 16 }}
          variant="body_md_regular"
        >{`During the last 30 days, the peak transaction volume was `}</Text>
        <Text variant="headline_bold">{data.lastThirtyDaysTransactions}</Text>
      </Row>

      <Container>
        <Column style={{ gap: 8 }}>
          <CardTotal
            onClick={() => {
              router.push(`/transactions?status=pending`);
            }}
            label="Pending"
            value={data.pendingTransactions}
          />
          <CardTotal
            onClick={() => {
              router.push(
                `/transactions?type=conversion&dateField=completedAt&startDate=${today}&endDate=${today}`
              );
            }}
            label="Conversion Today"
            value={data.completedConversions}
          />
          <CardTotal
            onClick={() => {
              router.push(
                `/transactions?dateField=completedAt&startDate=${today}&endDate=${today}&type=payment&status=completed`
              );
            }}
            label="Payments Today"
            value={data.completedTransactions}
          />
        </Column>
        <Row style={{ width: '100%', gap: 16 }}>
          <CardStatus
            onClick={() => {
              router.push(`/in-approval`);
            }}
            status="In Approval"
            description="Payments"
            value={data.pendingApproval}
            icon="bill-list"
          />
          <CardStatus
            onClick={() => {
              router.push(`/in-approval?statusApproval=rejected`);
            }}
            status="Rejected"
            description="Payments"
            value={data.rejectedPayments}
            icon="bill-cross"
          />
          <CardStatus
            onClick={() => {
              router.push(`/transactions?status=failed`);
            }}
            status="Failed"
            description="Payments"
            value={data.failedPayments}
            icon="danger-triangle"
          />
          <CardStatus
            onClick={() => {
              router.push(`/transactions?status=scheduled`);
            }}
            status="Scheduled"
            description=""
            value={data.awaitingFunds}
            icon="calendar-search"
          />
        </Row>
      </Container>
    </>
  );
};

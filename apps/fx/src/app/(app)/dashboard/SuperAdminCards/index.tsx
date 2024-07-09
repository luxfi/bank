import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { useDashboard } from '@/store/useDashboard';
import {
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { CardStatus } from '../components/CardStatus';
import { AddClientButton } from './styles';

export function SuperAdminCards() {
  const { theme } = useTheme();
  const router = useRouter();
  const { getSuperAdminDashboardInfo } = useDashboard();

  const [totals, setTotals] = useState({
    transactions: 0,
    beneficiaries: 0,
    clients: 0,
    riskAssesment: 0,
  });

  const getDashboardInfo = async () => {
    await getSuperAdminDashboardInfo().then((response) => {
      setTotals({
        transactions: response.lastTransactionsIn30Days,
        beneficiaries: response.beneficiariesPending,
        clients: response.clientsForApproval,
        riskAssesment: response.riskAssessmentPending,
      });
    });
  };

  useEffect(() => {
    getDashboardInfo();
  }, []);

  return (
    <Column width="100%">
      <Row gap="sm" align="center">
        <Text variant="headline_semibold">Overall Overview</Text>
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
            end={totals.transactions}
            decimal="."
            className="count"
          />
        </Text>
        <Text variant="headline_semibold">transactions</Text>
      </Row>

      <Row width="100%" gap="sm" style={{ marginBlock: '32px' }}>
        <AddClientButton onClick={() => router.push('/clients/new')}>
          <Row gap="xs">
            <Icon variant="plus1" />
            <Column>
              <Text variant="body_md_semibold">New Client</Text>
              <Text
                variant="body_sm_semibold"
                color={theme.textColor.layout.secondary.value}
              >
                Create a new client
              </Text>
            </Column>
          </Row>
        </AddClientButton>

        <CardStatus
          value={totals.beneficiaries}
          status="Beneficiaries"
          description="Pending"
          icon="case-round-minimalistic"
          onClick={() => router.push('/beneficiaries?status=pending')}
        />
        <CardStatus
          value={totals.clients}
          status="Accounts to be linked"
          description="Pending"
          icon="calendar-search"
          onClick={() => router.push('/clients?gateway=Unlinked')}
        />
        <CardStatus
          value={totals.riskAssesment}
          status="Risk assessment"
          description="Pending"
          icon="clipboard-list"
          onClick={() => router.push('/clients?riskRating=pending')}
        />
      </Row>
    </Column>
  );
}

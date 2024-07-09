'use client';

import Transactions from '@/app/(app)/transactions/page';
import { Row } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';

export default function ClientTransactions() {
  return (
    <>
      <HeaderClientsDetails />
      <Row width="100%" padding="lg">
        <Transactions />
      </Row>
    </>
  );
}

'use client';

import Users from '@/app/(app)/users/page';
import { Row } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';

export default function ClientUsers() {
  return (
    <>
      <HeaderClientsDetails />
      <Row width="100%" padding="lg">
        <Users />
      </Row>
    </>
  );
}

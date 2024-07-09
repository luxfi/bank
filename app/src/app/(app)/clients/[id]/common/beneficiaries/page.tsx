'use client';

import Beneficiaries from '@/app/(app)/beneficiaries/page';
import { Row } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';

export default function ClientBeneficiaries() {
  return (
    <>
      <HeaderClientsDetails />
      <Row width="100%" padding="lg">
        <Beneficiaries />
      </Row>
    </>
  );
}

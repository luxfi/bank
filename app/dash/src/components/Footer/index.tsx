/* eslint-disable prettier/prettier */

import Link from 'next/link';
import { LuxLogo } from '@luxfi/logo';
import { LUX_BRAND } from '@luxbank/brand';

import { Constants } from '@/lib/constants';

import {
  CenterColumn,
  Container,
  InnerContainer,
  LeftColumn,
  LeftColumnText,
  MaxRightColumn,
  RightColumn,
} from './styles';

export default function Footer() {
  const { jurisdiction } = LUX_BRAND;
  const address = jurisdiction.legalEntity.registeredAddress;

  return (
    <Container>
      <InnerContainer>
        <LeftColumn>
          <Link href={'/'}>
            <LuxLogo variant="white" size={50} />
          </Link>

          <LeftColumnText>
            {LUX_BRAND.name} <br />
            {address.line1}, {address.city}, {address.postalCode}, {address.country} <br />
            {LUX_BRAND.name} - © Copyright {new Date().getFullYear()}
          </LeftColumnText>
        </LeftColumn>

        <CenterColumn>
          <span>
            {jurisdiction.disclaimers.general}
            <br />
            <br />
            {jurisdiction.disclaimers.safeguarding}
          </span>
        </CenterColumn>

        <RightColumn>
          <div>
            <Link href={Constants.PRIVACY_POLICY_URL}>Privacy Policy</Link>
            <span> | </span>
            <Link href={Constants.TERMS_OF_SERVICE_URL}>
              Terms & Conditions
            </Link>
          </div>
        </RightColumn>

        <MaxRightColumn>
          {jurisdiction.regulators[0]?.name}
        </MaxRightColumn>
      </InnerContainer>
    </Container>
  );
}

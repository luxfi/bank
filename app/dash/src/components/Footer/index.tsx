/* eslint-disable prettier/prettier */

import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <Container>
      <InnerContainer>
        <LeftColumn>
          <Link href={'/'}>
            <Image
              alt="CDAX Forex"
              src={'image/footer-logo.svg'}
              width={50}
              height={50}
            />
          </Link>

          <LeftColumnText>
            CDAX Forex <br />
            135485C
            <br />
            27 Hope Street, Douglas, IM1 1AR, Isle of Man <br />
            CDAX Forex - © Copyright {new Date().getFullYear()}
          </LeftColumnText>
        </LeftColumn>

        <CenterColumn>
          <span>
            Licensed by the Isle of Man Financial Services Authority.
            <br />
            <br />
            CDAX Forex is a registered trading name of CDAX Limited.
            <br />
            Registered office: 27 Hope Street, Douglas, Isle of Man, IM1 1AR
            <br />
            Company number: 135485C
            <br />
            <br />
            The money transmission services we provide do not constitute deposit
            taking activity and are not protected by a compensation scheme
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
          Regulated by the IOM Financial Services Authority
        </MaxRightColumn>
      </InnerContainer>
    </Container>
  );
}

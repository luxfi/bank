'use client';

import { Row, Text, useTheme } from '@luxbank/ui';
import { LUX_BRAND } from '@luxbank/brand';

import { Container, Divider } from './styles';

export default function About() {
  const { theme } = useTheme();
  const { jurisdiction, domains } = LUX_BRAND;
  const { legalEntity, regulators, disclaimers } = jurisdiction;
  const regulator = regulators[0];
  const address = legalEntity.registeredAddress;
  const formattedAddress = `${address.line1}, ${address.city}, ${address.postalCode}, ${address.country}`;

  return (
    <Container>
      <Text variant="headline_regular">About</Text>

      <div>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          {legalEntity.registrationNumber}
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          {formattedAddress}
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          {LUX_BRAND.name} - © Copyright {new Date().getFullYear()}
        </Text>
      </div>

      <div>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          Licensed by the {regulator.name}.
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          {LUX_BRAND.name} is a registered trading name of {legalEntity.name}.
        </Text>
        <Row align="center" gap="xxxs">
          <Text
            variant="body_sm_bold"
            color={theme.textColor.interactive.placeholder.value}
          >
            Registered office:
          </Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.interactive.placeholder.value}
            style={{ flexDirection: 'row' }}
          >
            {formattedAddress}
          </Text>
        </Row>
        <Row align="center" gap="xxxs">
          <Text
            variant="body_sm_bold"
            color={theme.textColor.interactive.placeholder.value}
          >
            Company number:
          </Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.interactive.placeholder.value}
          >
            {legalEntity.registrationNumber}
          </Text>
        </Row>
      </div>

      <Text
        variant="body_sm_regular"
        color={theme.textColor.interactive.placeholder.value}
      >
        {disclaimers.general}
      </Text>

      <Row justify="center" align="center" gap="lg">
        <Text
          variant="interactive_md_link"
          href={`https://${domains.primary}/privacy-policy`}
          color={theme.textColor.interactive.default.value}
        >
          Privacy Policy
        </Text>
        <Divider />
        <Text
          variant="interactive_md_link"
          href={`https://${domains.primary}/terms-and-conditions`}
          color={theme.textColor.interactive.default.value}
        >
          Terms & Conditions
        </Text>
      </Row>
    </Container>
  );
}

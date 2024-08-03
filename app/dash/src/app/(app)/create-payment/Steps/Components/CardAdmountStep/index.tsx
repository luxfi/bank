'use client';

import { Container, Label, Value, ValueContainer } from './styles';

interface IProps {
  beneficiary: string;
  entityType: string;
  address: string;
  bankCountry: string;
  swiftCode: string;
  iban: string;
  style?: React.CSSProperties;
}

export default function CardAmount({
  address,
  bankCountry,
  beneficiary,
  entityType,
  style,
  iban,
  swiftCode,
}: IProps) {
  return (
    <Container style={style}>
      <ValueContainer>
        <Label>Beneficiary</Label>
        <Value>{beneficiary}</Value>
      </ValueContainer>

      <ValueContainer>
        <Label>Entity Type</Label>
        <Value>{entityType}</Value>
      </ValueContainer>

      <ValueContainer>
        <Label>Address</Label>
        <Value>{address}</Value>
      </ValueContainer>

      <ValueContainer>
        <Label>Bank Country</Label>
        <Value>{bankCountry}</Value>
      </ValueContainer>

      <ValueContainer>
        <Label>{`BIC/SWIFT Code`}</Label>
        <Value>{swiftCode}</Value>
      </ValueContainer>

      <ValueContainer>
        <Label>{`IBAN Number`}</Label>
        <Value>{iban}</Value>
      </ValueContainer>
    </Container>
  );
}

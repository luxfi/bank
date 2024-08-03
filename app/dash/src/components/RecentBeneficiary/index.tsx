'use client';

import { useMemo } from 'react';

import { IBeneficiaryListResponse } from '@/models/beneficiaries';

import { Container, ContainerRounded, Text, Title } from './styles';

interface IProps {
  beneficiary: IBeneficiaryListResponse;
  onClick?: (beneficiary: IBeneficiaryListResponse) => void;
}

export default function RecentBeneficiary({ beneficiary, onClick }: IProps) {
  const initialsParts = useMemo(() => {
    const splitText = beneficiary.name.trim().split(' ');
    const firstLetter = splitText[0][0];
    const lastLetter = splitText[splitText.length - 1][0];
    return `${firstLetter}${lastLetter}`.toLocaleUpperCase();
  }, [beneficiary]);

  return (
    <Container onClick={() => onClick?.(beneficiary)}>
      <ContainerRounded>
        <Title>{initialsParts}</Title>
      </ContainerRounded>
      <Text>{beneficiary.name}</Text>
    </Container>
  );
}

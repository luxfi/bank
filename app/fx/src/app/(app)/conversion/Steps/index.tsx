'use client';

import { ReactNode, useMemo } from 'react';

import { BackButton } from '@/components/BackButton';
import Steps from '@/components/Step';

import { EStepConversion, useContextConversion } from '@/context/Conversions';

import { Container, StepContainer, Title } from '../styles';
import { stepsConversions } from '../types';
import { Complete } from './Complete';
import { CurrencyBeneficiary } from './CurrencyBeneficiary';
import { Date } from './Date';
import { Quote } from './Quote';

export default function Payment() {
  const { currentStep } = useContextConversion();

  const renderStep: Record<EStepConversion, ReactNode> = {
    CURRENCY_AMOUNT: <CurrencyBeneficiary />,
    DATE: <Date />,
    QUOTE: <Quote />,
    COMPLETE: <Complete />,
  };

  const getCurrentStep = useMemo(() => {
    return (
      Object.keys(EStepConversion).findIndex((key) => key === currentStep) + 1
    );
  }, [currentStep]);

  const renderTitleStep: Record<EStepConversion, string> = {
    CURRENCY_AMOUNT: 'Currency & Amount',
    DATE: 'Date',
    QUOTE: 'Quote',
    COMPLETE: 'Conversion',
  };

  return (
    <Container>
      <BackButton>Conversion</BackButton>

      <StepContainer>
        <Steps current={getCurrentStep} items={stepsConversions} />
      </StepContainer>

      <Title style={{ marginTop: 18 }}>{renderTitleStep[currentStep]}</Title>

      {renderStep[currentStep]}
    </Container>
  );
}

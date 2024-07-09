'use client';

import { ReactNode, useCallback, useMemo } from 'react';

import Steps, { IStepItems } from '@/components/Step';

import { EStep, useCreatePayment } from '@/context/CreatePayment';

import { Button, Row, Text } from '@cdaxfx/ui';

import { Amount } from '../Steps/Amount';
import CurrencyAmount from '../Steps/CurrencyBeneficiary';
import { Reason } from '../Steps/Reason';
import { ReviewPay } from '../Steps/ReviewPay';
import { Container, StepContainer, Title } from '../styles';
import { Complete } from './Complete';

export default function Payment() {
  const { data, onChangeData } = useCreatePayment();

  const renderStep: Record<EStep, ReactNode> = {
    CURRENCY_BENEFICIARY: <CurrencyAmount />,
    AMOUNT: <Amount />,
    REASON: <Reason />,
    REVIEW_PAY: <ReviewPay />,
    COMPLETE: <Complete />,
  };

  const getCurrentStep = useMemo(() => {
    return Object.keys(EStep).findIndex((key) => key === data.currentStep) + 1;
  }, [data.currentStep]);

  const renderTitleStep: Record<EStep, string> = {
    CURRENCY_BENEFICIARY: 'Where do you want create payment ?',
    AMOUNT: 'What is the payment amount ?',
    REASON: `What's the reason for payment ?`,
    REVIEW_PAY: `Review details of your payment`,
    COMPLETE: '',
  };

  const stepsPayments: Array<IStepItems> = useMemo(
    () => [
      { title: 'Currency & Beneficiary' },
      { title: 'Reason' },
      { title: 'Amount' },
      { title: 'Review & Pay' },
    ],
    []
  );

  const handleBack = useCallback(() => {
    if (data.currentStep === EStep.CURRENCY_BENEFICIARY) {
      return;
    }
    if (data.currentStep === EStep.REASON) {
      return onChangeData('currentStep', EStep.CURRENCY_BENEFICIARY);
    }

    if (data.currentStep === EStep.AMOUNT) {
      return onChangeData('currentStep', EStep.REASON);
    }

    if (data.currentStep === EStep.REVIEW_PAY) {
      return onChangeData('currentStep', EStep.AMOUNT);
    }
  }, [data.currentStep, onChangeData]);

  const shouldShowBackButton = useMemo(() => {
    return ![EStep.COMPLETE, EStep.CURRENCY_BENEFICIARY].includes(
      data.currentStep
    );
  }, [data.currentStep]);

  return (
    <Container>
      <Title style={{ alignSelf: 'flex-start' }}>Payment</Title>

      <StepContainer>
        <Steps current={getCurrentStep} items={stepsPayments} />
      </StepContainer>

      <Row
        align="center"
        justify={shouldShowBackButton ? 'space-between' : 'center'}
        style={{ alignSelf: 'flex-start', width: '100%' }}
      >
        {shouldShowBackButton && (
          <Button
            leftIcon="arrow-left"
            text="Back"
            variant="tertiary"
            onClick={handleBack}
          />
        )}

        <Text variant="headline_regular" style={{ marginTop: 18 }}>
          {renderTitleStep[data.currentStep]}
        </Text>

        {shouldShowBackButton && <div style={{ width: 116 }} />}
      </Row>

      {renderStep[data.currentStep]}
    </Container>
  );
}

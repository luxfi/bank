import { useCallback, useState } from 'react';

import Input from '@/components/Input';

import { EStep, useCreatePayment } from '@/context/CreatePayment';
import { useNotification } from '@/context/Notification';

import { LoadingOutlined } from '@ant-design/icons';
import { Button } from '@cdaxfx/ui';

import { defaultTheme } from '@/styles/themes/default';

import {
  ActionContainer,
  ContentContainer,
  SectionContainer,
  WrapperButton,
} from '../styles';

export function Reason() {
  const { onChangeData, selected, onChangeSelected, isLoading, resetPayment } =
    useCreatePayment();
  const { onShowNotification } = useNotification();

  const [checkError, setCheckError] = useState<boolean>(false);

  const handleContinue = useCallback(async () => {
    if (!selected?.paymentReason || !selected?.paymentReference) {
      setCheckError(true);
      return onShowNotification({
        type: 'ERROR',
        message: 'Fill in all fields',
        description: '',
      });
    }

    return onChangeData('currentStep', EStep.AMOUNT);
  }, [
    selected?.paymentReason,
    selected?.paymentReference,
    onChangeData,
    onShowNotification,
  ]);

  const handleCancel = useCallback(() => {
    resetPayment();
  }, [resetPayment]);

  return (
    <>
      <ContentContainer>
        <SectionContainer style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              maxWidth: 600,
            }}
          >
            <Input
              label="Payment Reason*"
              placeholder="Enter payment reason"
              helper="Information will be provided to compliance."
              value={selected?.paymentReason}
              onChange={(value) => onChangeSelected('paymentReason', value)}
              error={
                checkError && !selected?.paymentReason
                  ? 'Enter Payment Reason'
                  : ''
              }
            />

            <Input
              label="Payment Reference*"
              placeholder="Enter payment reference"
              helper="Information that will be provided to the beneficiary bank and should appear on their statement. Please note this text may be truncated or removed."
              value={selected?.paymentReference}
              onChange={(value) => onChangeSelected('paymentReference', value)}
              error={
                checkError && !selected?.paymentReference
                  ? 'Enter Payment Reference'
                  : ''
              }
            />
          </div>
        </SectionContainer>
      </ContentContainer>

      <ActionContainer>
        {isLoading ? (
          <LoadingOutlined
            style={{
              color: defaultTheme.colors.secondary,
              fontSize: 40,
              fontWeight: 600,
              paddingBlock: 40,
            }}
          />
        ) : (
          <>
            <WrapperButton>
              <Button
                onClick={handleCancel}
                text="Cancel"
                roundness="rounded"
                variant="secondary"
              />
            </WrapperButton>
            <WrapperButton>
              <Button
                onClick={handleContinue}
                text="Continue"
                roundness="rounded"
              />
            </WrapperButton>
          </>
        )}
      </ActionContainer>
    </>
  );
}

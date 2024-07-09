import { useCallback, useState } from 'react';

import ModalResult from '@/components/ModalResult';

import { EStep, useCreatePayment } from '@/context/CreatePayment';

import { LoadingOutlined } from '@ant-design/icons';
import { Button } from '@cdaxfx/ui';

import { defaultTheme } from '@/styles/themes/default';

import { ActionContainer, ContentContainer, WrapperButton } from '../styles';
import { PaymentCard } from './Components/CardPayment';
import { useTransactions } from '@/store/useTransactions';

export function ReviewPay() {
  const { setApprovalCount } = useTransactions();
  const { selected, createPayment, onChangeData, isLoading, resetPayment } =
    useCreatePayment();

  const [modalFailed, setModalFailed] = useState<{
    isVisible: boolean;
    title: string;
    description: string;
  }>({
    isVisible: false,
    title: '',
    description: '',
  });

  const handleBackToAmountAndDate = useCallback(() => {
    setModalFailed({
      isVisible: false,
      title: '',
      description: '',
    });
    onChangeData('currentStep', EStep.AMOUNT);
  }, [onChangeData]);

  const handleContinue = useCallback(async () => {
    const paymentCompleted = await createPayment();
    await setApprovalCount();

    if (paymentCompleted.success) {
      return onChangeData('currentStep', EStep.COMPLETE);
    }

    setModalFailed({
      isVisible: true,
      title: 'The payment failed!',
      description: paymentCompleted.message,
    });
  }, [createPayment, setApprovalCount, onChangeData]);

  const handleCancel = useCallback(() => {
    resetPayment();
  }, [resetPayment]);
  return (
    <>
      <ContentContainer
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          style={{
            width: 638,
          }}
        >
          <PaymentCard
            type="review"
            transaction={{
              in: { amount: selected?.amount },
              out: { amount: selected?.amount, currency: selected?.currency },
              settlementDate: selected?.date,
              paymentType: selected?.type,
              payment: {
                reason: selected?.paymentReason,
                paymentReference: selected?.paymentReference,

                beneficiary: {
                  entityType: selected?.beneficiary?.entityType,
                  address: selected?.beneficiary?.address,
                  city: selected?.beneficiary?.city,
                  name: selected.beneficiary?.name,
                },

                beneficiaryBank: {
                  country: selected.beneficiary?.bankCountry,
                  routingCodes: [
                    {
                      name: 'bic swift',
                      value: selected.beneficiary?.bicSwift,
                    },
                    {
                      name: 'iban',
                      value: selected.beneficiary?.iban,
                    },
                  ],
                },
              },
            }}
          />
        </div>
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
                text="Confirm Payment"
                roundness="rounded"
              />
            </WrapperButton>
          </>
        )}
      </ActionContainer>

      <ModalResult
        isVisible={modalFailed.isVisible}
        onCancel={handleBackToAmountAndDate}
        title={modalFailed.title}
        subtitle={modalFailed.description}
        type="FAIL"
      />
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ModalResult from '@/components/ModalResult';

import { useCreatePayment } from '@/context/CreatePayment';

import { formatCurrency } from '@/utils/lib';

import { Button } from '@cdaxfx/ui';

import { ActionContainer, ContentContainer, WrapperButton } from '../styles';
import { PaymentCard } from './Components/CardPayment';

export function Complete() {
  const router = useRouter();

  const { paymentCompleted, resetPayment } = useCreatePayment();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(true);

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
          {paymentCompleted && (
            <PaymentCard type="created" transaction={paymentCompleted} />
          )}
        </div>
      </ContentContainer>

      <ActionContainer>
        <WrapperButton>
          <Button
            onClick={() => resetPayment()}
            text="Make Another Payment"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            onClick={() => router.push('/dashboard')}
            text="View Dashboard"
            roundness="rounded"
          />
        </WrapperButton>
      </ActionContainer>

      <ModalResult
        isVisible={modalIsVisible}
        onCancel={() => setModalIsVisible(false)}
        title={
          paymentCompleted?.isPendingApproval
            ? 'Successfully submitted for approval!'
            : 'Your payment was Successfully created!'
        }
        subtitle={`Great, the payment of ${formatCurrency(
          Number(paymentCompleted?.out.amount)
        )} ${paymentCompleted?.out.currency} to ${
          paymentCompleted?.payment.beneficiary?.name
        } was successfully ${
          paymentCompleted?.isPendingApproval
            ? 'submitted for approval'
            : 'created'
        }!`}
        type="SUCCESS"
      />
    </>
  );
}

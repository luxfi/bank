import { useCallback, useState } from 'react';

import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { EStep, useCreatePayment } from '@/context/CreatePayment';
import { useNotification } from '@/context/Notification';

import { Button } from '@luxbank/ui';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

import { getDeliveryDate } from '@/api/payment';

import {
  ActionContainer,
  ContentContainer,
  SectionContainer,
  WrapperButton,
} from '../styles';
import CardAmount from './Components/CardAdmountStep';
import SectionTitle from './Components/SectionTitle';

export function Amount() {
  const { onShowNotification } = useNotification();
  const { onChangeData, selected, onChangeSelected, resetPayment } =
    useCreatePayment();

  const [checkError, setCheckError] = useState<boolean>(false);

  const postDeliveryDate = useCallback(async () => {
    await getDeliveryDate({
      bank_country: selected?.beneficiary?.bankCountry ?? '',
      currency: selected?.currency ?? '',
      payment_date: selected?.date ?? '',
      payment_type: selected?.type ?? '',
    });
  }, [selected]);

  const handleContinue = useCallback(() => {
    if (!selected?.date || !selected?.amount || !selected?.type) {
      setCheckError(true);
      return onShowNotification({
        type: 'ERROR',
        message: 'Fill in all fields',
        description: '',
      });
    }

    postDeliveryDate();

    onChangeData('currentStep', EStep.REVIEW_PAY);
  }, [
    onChangeData,
    onShowNotification,
    postDeliveryDate,
    selected?.amount,
    selected?.date,
    selected?.type,
  ]);

  const handleCancel = useCallback(() => {
    resetPayment();
  }, [resetPayment]);

  return (
    <>
      <ContentContainer>
        <SectionContainer>
          <SectionTitle title="Currency" />

          <div
            style={{
              width: 400,
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            <Input
              variant="currency"
              label="Amount"
              placeholder="Amount"
              value={selected?.amount}
              onChange={(value) => onChangeSelected('amount', value)}
              error={checkError && !selected?.amount ? 'Enter Amount' : ''}
            />

            <SelectDate
              label="Date"
              placeholder="Select Date"
              info={`To ensure your payment is made on the date intended, please make applicable adjustments to payment date to refflect the offset against GMT. You're not able to make payments on a date preceding the local time of payment destination.`}
              value={selected?.date}
              disabledDate={(date) => {
                const today = dayjs().tz('Europe/London');
                return (
                  date.isBefore(today, 'day') ||
                  date.day() === 0 ||
                  date.day() === 6
                );
              }}
              onChange={(value) => onChangeSelected('date', value)}
              helper="Please remember to offset your payment date against GMT."
              error={checkError && !selected?.date ? 'Selected Date' : ''}
            />
            <Select
              label="Type"
              placeholder="Select Priority"
              value={selected?.type}
              onChange={(value) => onChangeSelected('type', value)}
              options={[
                { label: 'Priority', value: 'priority' },
                { label: 'Regular', value: 'regular' },
              ]}
              error={checkError && !selected?.type ? 'Selected type' : ''}
            />
          </div>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle title="Beneficiary" />

          {selected?.beneficiary && (
            <CardAmount
              style={{ marginTop: 24 }}
              address={selected?.beneficiary?.address}
              bankCountry={selected?.beneficiary.bankCountry}
              beneficiary={selected?.beneficiary.name}
              entityType={selected?.beneficiary.entityType}
              iban={selected?.beneficiary.iban}
              swiftCode={selected?.beneficiary.bicSwift}
            />
          )}
        </SectionContainer>
      </ContentContainer>

      <ActionContainer>
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
      </ActionContainer>
    </>
  );
}

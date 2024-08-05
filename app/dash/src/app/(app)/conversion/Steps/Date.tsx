import Link from 'next/link';
import { useCallback } from 'react';

import SelectDate from '@/components/SelectDate';

import { EStepConversion, useContextConversion } from '@/context/Conversions';

import { Button, Row, Text } from '@luxbank/ui';
import { default as dayjs, default as days } from 'dayjs';
import { useFormik } from 'formik';

import {
  ActionContainer,
  ContentContainer,
  LabelCalc,
  LabelValueCalc,
  WrapperButton,
} from '../styles';

export const Date: React.FC = () => {
  const {
    onChangeConversionData,
    resetConversion,
    invalidDates,
    nextDayConversionDate,
  } = useContextConversion();

  const disabledDate = useCallback(
    (current: days.Dayjs) => {
      if (
        current &&
        current.isBefore(dayjs(nextDayConversionDate).startOf('day'))
      ) {
        return true;
      }

      return invalidDates.some(
        (disabledDate) => current.format('YYYY-MM-DD') === disabledDate
      );
    },
    [invalidDates, nextDayConversionDate]
  );

  const formik = useFormik({
    initialValues: {
      date: '',
    },
    onSubmit: () => handleSubmit(),
  });

  const handleSubmit = () => {
    onChangeConversionData('dateOfConversion', formik.values.date);
    onChangeConversionData('currentStep', EStepConversion.QUOTE);
  };

  return (
    <>
      <ContentContainer style={{ justifyContent: 'center' }}>
        <div style={{ width: 768 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 16,
            }}
          >
            <LabelValueCalc>{'Select Date of Conversion'}</LabelValueCalc>
            <LabelCalc>
              {'Please remember to offset your payment date against GMT.*'}
            </LabelCalc>
          </div>

          <div style={{ width: 400, marginBottom: 24 }}>
            <SelectDate
              disabledDate={disabledDate}
              label="Date"
              value={formik.values.date}
              onChange={formik.handleChange('date')}
            />
          </div>

          <Row gap="xxxs">
            <Text variant="body_sm_regular">
              By clicking on `Get a Quote` you agree with our
            </Text>
            <Link
              target={'_blank'}
              href={'https://cdax.forex/terms-and-conditions'}
            >
              <Text
                color="#AB671A"
                variant="body_sm_regular"
                style={{ textDecoration: 'underline' }}
              >
                Terms of use
              </Text>
            </Link>
          </Row>
        </div>
      </ContentContainer>

      <ActionContainer>
        <WrapperButton>
          <Button
            onClick={() => resetConversion()}
            text="Cancel"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            disabled={!formik.values.date}
            onClick={() => formik.handleSubmit()}
            text="Get a Quote"
            roundness="rounded"
          />
        </WrapperButton>
      </ActionContainer>
    </>
  );
};

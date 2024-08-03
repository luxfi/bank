import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  IDataSelectCurrency,
  InputNumberSelectCurrency,
} from '@/components/InputNumberSelectCurrency';

import { IConvertCurrencyAmount } from '@/models/currencies';

import { EStepConversion, useContextConversion } from '@/context/Conversions';
import { useNotification } from '@/context/Notification';

import { formatCurrency } from '@/utils/lib';

import useDebounce from '@/hooks/useDebounce';
import useUrlSearchParams from '@/hooks/useUrlParams';
import { useConversions } from '@/store/useConversions';
import { IConversionPreviewResponse } from '@/store/useConversions/types';
import { Button } from '@luxbank/ui';
import { useFormik } from 'formik';
import _ from 'underscore';

import {
  ActionContainer,
  ContainerCalcCurrency,
  ContentContainer,
  LabelCalc,
  LabelValueCalc,
  WrapperButton,
} from '../styles';
import { DividerCurrencyInvertConversion } from './components/DividerCurrencyInvertConversion';

interface IFormProps {
  sell: string;
  sellCurrency?: IDataSelectCurrency;
  buy: string;
  buyCurrency?: IDataSelectCurrency;
}

type TAction = 'buy' | 'sell';
const initFormValues: IFormProps = {
  sell: '',
  buy: '',
};

export const CurrencyBeneficiary: React.FC = () => {
  const { onChangeConversionData, resetConversion } = useContextConversion();
  const { setConversionPreview } = useConversions();
  const { onShowNotification } = useNotification();
  const { urlParams } = useUrlSearchParams<{ currency: string }>();

  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [amountTo, setAmountTo] = useState<TAction | null>(null);
  const [labelRate, setLabelRate] = useState<string>('');
  const [rate, setRate] = useState<string>('');

  const formik = useFormik<IFormProps>({
    initialValues: initFormValues,
    onSubmit: () => handleSubmit(),
  });

  const debounceValue = useMemo(() => {
    return amountTo === 'buy' ? formik.values.buy : formik.values.sell;
  }, [amountTo, formik.values.buy, formik.values.sell]);

  const fetchDebounce = useDebounce(debounceValue, 1000);

  const handleSubmit = (): void => {
    const { buy, sell, buyCurrency, sellCurrency } = formik.values;

    onChangeConversionData('amountTo', amountTo ?? '');
    onChangeConversionData('sellCurrency', {
      value: Number(sell),
      currency: sellCurrency?.id ?? '',
    });
    onChangeConversionData('buyCurrency', {
      value: Number(buy),
      currency: buyCurrency?.id ?? '',
    });
    onChangeConversionData('rate', Number(rate));
    onChangeConversionData('currentStep', EStepConversion.DATE);
  };

  const disabledButtonInvert = useMemo(() => {
    return !(
      (formik?.values.buy && formik.values?.buyCurrency) ||
      (formik?.values.sell && formik.values?.sellCurrency)
    );
  }, [formik.values]);

  const calcRate = async (value: string) => {
    if (isLoadingRate) return;
    if (!value || !amountTo) return;

    const makePayload = (day?: string) => ({
      amount: Number(value),
      buyCurrency: formik.values?.buyCurrency?.id ?? '',
      sellCurrency: formik.values?.sellCurrency?.id ?? '',
      date: day ?? 'today',
      direction: amountTo ?? '',
    });

    try {
      setIsLoadingRate(true);

      const response = await setConversionPreview(makePayload());

      const invalidDates = (response as unknown as IConvertCurrencyAmount)
        ?.invalid_conversion_dates;

      if (invalidDates) {
        const data = [...Object.keys(invalidDates).map((key) => key)];
        onChangeConversionData('invalidDates', data);
      }
      const nextDayConversionDate = (
        response as unknown as IConvertCurrencyAmount
      )?.next_day_conversion_date;

      if (nextDayConversionDate) {
        onChangeConversionData('nextDayConversionDate', nextDayConversionDate);
      }

      if (amountTo === 'buy') handleLabelBuy(response);
      if (amountTo === 'sell') handleLabelSell(response);
    } catch (error) {
      onShowNotification({
        type: 'ERROR',
        message: 'Error',
        description: (error as any)?.message ?? '',
      });
      formik.resetForm();
    } finally {
      setIsLoadingRate(false);
    }
  };

  const fetchRate = useCallback(() => {
    const value = amountTo === 'buy' ? formik.values.buy : formik.values.sell;

    _.debounce(calcRate, 1000)(value);
  }, [amountTo, formik.values]);

  useEffect(() => {
    if (
      (formik.values.buy || formik.values.sell) &&
      formik.values?.buyCurrency &&
      formik.values?.sellCurrency
    ) {
      fetchRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fetchDebounce,
    formik.values?.buyCurrency,
    formik.values?.sellCurrency,
    amountTo,
  ]);

  const handleLabelBuy = (data: IConversionPreviewResponse) => {
    formik.setFieldValue('sell', data.amount);

    setRate(data.rate);

    const sellAmount = Number(data.amount);
    const buyAmount = Number(formik.values.buy);
    const rate = (buyAmount / sellAmount).toFixed(2);

    setLabelRate(`${'1'} ${data.buyCurrency} = ${rate} ${data.sellCurrency}`);
  };

  const handleLabelSell = (data: IConversionPreviewResponse) => {
    formik.setFieldValue('buy', data.amount);

    setRate(data.rate);

    const sellAmount = Number(formik.values.sell);
    const buyAmount = Number(data.amount);
    const rate = (buyAmount / sellAmount).toFixed(2);

    setLabelRate(`${'1'} ${data.sellCurrency} = ${rate} ${data.buyCurrency}`);
  };

  const handleInvert = () => {
    formik.setFieldValue('sell', formik.values.buy);
    formik.setFieldValue('buy', formik.values.sell);

    // formik.setFieldValue('sellCurrency', formik.values.buyCurrency);
    // formik.setFieldValue('buyCurrency', formik.values.sellCurrency);

    setAmountTo((pS) => (pS === 'buy' ? 'sell' : 'buy'));
  };

  const disabledNextStep = useMemo((): boolean => {
    return !(
      !!formik.values.buy &&
      !!formik.values.sell &&
      !!formik.values?.buyCurrency &&
      !!formik.values?.sellCurrency
    );
  }, [formik.values]);

  return (
    <>
      <ContentContainer style={{ justifyContent: 'center' }}>
        <div style={{ width: 768 }}>
          <InputNumberSelectCurrency
            currencyToExclude={formik.values?.buyCurrency?.id}
            defaultCurrency={urlParams?.currency}
            disabled={isLoadingRate}
            disabledCurrency={isLoadingRate}
            onChange={(value) => {
              setAmountTo(!value ? null : 'sell');
              formik.setFieldValue('sell', value);
            }}
            onChangeCurrency={(value) =>
              formik.setFieldValue('sellCurrency', value)
            }
            valueCurrency={formik.values?.sellCurrency?.id}
            value={formik.values.sell}
            label="Sell"
          />
          {formik.values?.sellCurrency && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ContainerCalcCurrency>
                <LabelCalc>{'Balance available'}</LabelCalc>
                <LabelValueCalc>{`${
                  formik.values?.sellCurrency?.currency
                } ${formatCurrency(
                  formik.values?.sellCurrency?.amount
                )}`}</LabelValueCalc>
              </ContainerCalcCurrency>

              <WrapperButton style={{ width: 100, marginTop: 8 }}>
                <Button
                  disabled={isLoadingRate}
                  onClick={() => {
                    setAmountTo('sell');
                    formik.setFieldValue(
                      'sell',
                      formik.values.sellCurrency?.amount
                    );
                  }}
                  text="MAX"
                  roundness="rounded"
                  variant="secondary"
                />
              </WrapperButton>
            </div>
          )}

          <DividerCurrencyInvertConversion
            onClick={handleInvert}
            disabled={disabledButtonInvert}
            isAnimated={isLoadingRate}
          />

          <InputNumberSelectCurrency
            currencyToExclude={formik.values?.sellCurrency?.id}
            value={formik.values.buy}
            disabled={isLoadingRate}
            disabledCurrency={isLoadingRate}
            valueCurrency={formik.values?.buyCurrency?.id}
            onChange={(value) => {
              setAmountTo(!value ? null : 'buy');
              formik.setFieldValue('buy', value);
            }}
            onChangeCurrency={(value) =>
              formik.setFieldValue('buyCurrency', value)
            }
            label="Buy"
          />

          {formik?.values?.buyCurrency && (
            <ContainerCalcCurrency>
              <LabelCalc>{'Estimated exchange rate'}</LabelCalc>
              <LabelValueCalc>
                {isLoadingRate ? 'Loading...' : labelRate}
              </LabelValueCalc>
            </ContainerCalcCurrency>
          )}
        </div>
      </ContentContainer>

      <ActionContainer>
        <WrapperButton>
          <Button
            disabled={isLoadingRate}
            onClick={() => {
              formik.resetForm();
              resetConversion();
            }}
            text="Cancel"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            disabled={isLoadingRate || disabledNextStep}
            onClick={() => formik.handleSubmit()}
            text="Select Date"
            roundness="rounded"
          />
        </WrapperButton>
      </ActionContainer>
    </>
  );
};

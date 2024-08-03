import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

import Checkbox from '@/components/Checkbox';

import { EStepConversion, useContextConversion } from '@/context/Conversions';
import { useNotification } from '@/context/Notification';

import { formatCurrency, formattedDate } from '@/utils/lib';

import animationLoading from '@/animations/stepConvert.json';
import { useConversions } from '@/store/useConversions';
import { IConversionPreviewResponse } from '@/store/useConversions/types';
import { Button, Icon, useTheme } from '@luxbank/ui';

import {
  ActionContainer,
  ContentContainer,
  LabelValueCalc,
  QuoteExpireContainer,
  QuoteExpireCounter,
  QuoteExpireTitle,
  WrapperButton,
} from '../styles';
import { PreviewQuote } from './components/PreviewQuote';

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: animationLoading,
};

export const Quote: React.FC = () => {
  const { theme } = useTheme();
  const {
    buyCurrency,
    dateOfConversion,
    sellCurrency,
    amountTo,
    resetConversion,
    onChangeConversionData,
  } = useContextConversion();

  const { onShowNotification } = useNotification();
  const { setConversionPreview } = useConversions();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [counterExpired, setCounterExpired] = useState<number>(-1);
  const [data, setData] = useState<IConversionPreviewResponse>();

  const fetchQuote = async () => {
    try {
      setIsLoading(true);

      const amount =
        amountTo === 'buy'
          ? buyCurrency.value.toString()
          : sellCurrency.value.toString();

      const response = await setConversionPreview({
        amount: Number(amount ?? 0),
        buyCurrency: buyCurrency.currency ?? '',
        sellCurrency: sellCurrency.currency ?? '',
        date: dateOfConversion,
        direction: amountTo,
      });

      if (response?.quoteId) {
        onChangeConversionData('quoteId', response?.quoteId);
      }

      setData(response);
    } catch (error) {
      onShowNotification({
        type: 'ERROR',
        message: 'Error',
        description: (error as any)?.message ?? '',
      });
    } finally {
      setIsLoading(false);
      setCounterExpired(15);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (counterExpired >= -1) {
        setCounterExpired((pS) => pS - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchQuote();
  }, []);

  if (isLoading) {
    return (
      <div style={{ marginTop: 40 }}>
        <Lottie options={animationOptions} height={80} width={80} />
        <LabelValueCalc>Quote Loading...</LabelValueCalc>
      </div>
    );
  }

  return (
    <>
      <ContentContainer style={{ justifyContent: 'center' }}>
        {!!data && (
          <div style={{ width: 768 }}>
            <PreviewQuote
              selling={`${formatCurrency(
                sellCurrency?.value
              )}${data?.sellCurrency}`}
              buying={`${formatCurrency(
                buyCurrency?.value
              )}${data?.buyCurrency}`}
              rate={`${data?.rate}`}
              settlementDate={formattedDate(
                dateOfConversion ?? '',
                'DD MMM YYYY @ h:mm:ss a'
              )}
              conversionDate={formattedDate(
                dateOfConversion ?? '',
                'DD MMM YYYY @ h:mm:ss a'
              )}
              rateDate={formattedDate(
                dateOfConversion ?? '',
                'DD MMM YYYY @ h:mm:ss a'
              )}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <QuoteExpireContainer>
                <Icon
                  variant="clock-circle"
                  size="md"
                  color={
                    counterExpired < 0
                      ? theme.textColor.feedback['text-warning'].value
                      : theme.backgroundColor.interactive['primary-default']
                          .value
                  }
                />
                {counterExpired >= 0 ? (
                  <QuoteExpireTitle>
                    Quote Expired in{' '}
                    <QuoteExpireCounter>{counterExpired}</QuoteExpireCounter>{' '}
                    seconds
                  </QuoteExpireTitle>
                ) : (
                  <QuoteExpireTitle
                    style={{
                      color: theme.textColor.feedback['text-warning'].value,
                    }}
                  >
                    Quote Expired
                  </QuoteExpireTitle>
                )}
              </QuoteExpireContainer>

              {counterExpired >= 0 && (
                <Checkbox
                  containerStyle={{ marginLeft: 24, marginTop: 16 }}
                  label="I am happy with this quote"
                  checked={confirm}
                  onChange={setConfirm}
                />
              )}
            </div>
          </div>
        )}
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
            disabled={!confirm && counterExpired >= 0}
            onClick={() =>
              counterExpired >= 0
                ? onChangeConversionData(
                    'currentStep',
                    EStepConversion.COMPLETE
                  )
                : fetchQuote()
            }
            text={counterExpired >= 0 ? 'Convert' : 'Requote'}
            roundness="rounded"
          />
        </WrapperButton>
      </ActionContainer>
    </>
  );
};

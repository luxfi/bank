import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

import ModalResult from '@/components/ModalResult';

import { EStepConversion, useContextConversion } from '@/context/Conversions';
import { useMessages } from '@/context/Messages';

import { formatCurrency, formattedDate } from '@/utils/lib';

import animationLoading from '@/animations/stepConvert.json';
import { useConversions } from '@/store/useConversions';
import { IConversionResponse } from '@/store/useConversions/types';
import { Button } from '@luxbank/ui';

import {
  ActionContainer,
  ContentContainer,
  LabelValueCalc,
  WrapperButton,
} from '../styles';
import { PreviewQuote } from './components/PreviewQuote';

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: animationLoading,
};

export const Complete: React.FC = () => {
  const {
    buyCurrency,
    sellCurrency,
    amountTo,
    rate,
    quoteId,
    dateOfConversion,
    resetConversion,
    onChangeConversionData,
  } = useContextConversion();
  const { setConversion } = useConversions();
  const { onShowMessage } = useMessages();

  const route = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<IConversionResponse>();
  const [modalMessage, setModalMessage] = useState({
    isVisible: false,
    title: '',
    description: '',
    type: 'SUCCESS',
  });

  const completeQuote = async () => {
    try {
      setIsLoading(true);

      const amount =
        amountTo === 'buy'
          ? buyCurrency.value.toString()
          : sellCurrency.value.toString();

      const response = await setConversion({
        amount: Number(amount),
        buyCurrency: buyCurrency.currency.substring(0, 3),
        sellCurrency: sellCurrency.currency.substring(0, 3),
        date: dateOfConversion,
        direction: amountTo,
        quoteId: quoteId,
      });

      setModalMessage({
        description: `Great, conversion of ${`${formatCurrency(
          sellCurrency.value
        )} ${sellCurrency.currency}`} to ${`${formatCurrency(
          buyCurrency.value
        )} ${buyCurrency.currency}`}, was completed`,
        isVisible: true,
        title: 'Your Conversion was completed',
        type: 'SUCCESS',
      });

      setData(response as any);
    } catch (error) {
      onShowMessage({
        isVisible: true,
        title: 'The Conversion Failed',
        description: `There was a problem processing your transaction, review your details and try again in a few moments.`,
        type: 'message',
        status: 'fail',
        onClose: () => {
          onChangeConversionData('currentStep', EStepConversion.QUOTE);
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    completeQuote();
  }, []);

  if (isLoading) {
    return (
      <div style={{ marginTop: 40 }}>
        <Lottie options={animationOptions} height={80} width={80} />
        <LabelValueCalc>Create Conversion...</LabelValueCalc>
      </div>
    );
  }

  return (
    <>
      <ContentContainer style={{ justifyContent: 'center' }}>
        {!!data && (
          <div style={{ width: 768 }}>
            <PreviewQuote
              selling={`${formatCurrency(sellCurrency?.value)}${
                sellCurrency.currency
              }`}
              buying={`${formatCurrency(
                buyCurrency?.value
              )}${buyCurrency?.currency}`}
              rate={`${rate}`}
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
              transactionId={data.id ?? ''}
            />
          </div>
        )}
      </ContentContainer>

      <ActionContainer>
        <WrapperButton>
          <Button
            onClick={() => route.push('/dashboard')}
            text="Dashboard"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            onClick={() => route.push('/wallet')}
            text="View Balance"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            onClick={() => route.push('/create-payment')}
            text="Make Payment"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
        <WrapperButton>
          <Button
            onClick={() => resetConversion()}
            text="New Conversion"
            roundness="rounded"
            variant="secondary"
          />
        </WrapperButton>
      </ActionContainer>

      <ModalResult
        isVisible={modalMessage.isVisible}
        onCancel={() =>
          setModalMessage((pS) => ({
            ...pS,
            isVisible: false,
          }))
        }
        title={modalMessage.title}
        subtitle={modalMessage.description}
        type={modalMessage.type as any}
      />
    </>
  );
};

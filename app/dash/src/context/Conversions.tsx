'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export enum EStepConversion {
  CURRENCY_AMOUNT = 'CURRENCY_AMOUNT',
  DATE = 'DATE',
  QUOTE = 'QUOTE',
  COMPLETE = 'COMPLETE',
}

interface ISelectedCurrency {
  currency: string;
  value: number;
}

interface IBaseValuesConversions {
  sellCurrency: ISelectedCurrency;
  buyCurrency: ISelectedCurrency;
  dateOfConversion: string;
  rate: number;
  amountTo: string;
  currentStep: EStepConversion;
  invalidDates: Array<string>;
  quoteId?: string;
  nextDayConversionDate?: string;
}

interface IProps extends IBaseValuesConversions {
  resetConversion(): void;
  onChangeConversionData<T extends keyof IBaseValuesConversions>(
    key: T,
    value: IBaseValuesConversions[T]
  ): void;
}

const initConversion: IBaseValuesConversions = {
  buyCurrency: {
    currency: '',
    value: 0,
  },
  sellCurrency: {
    currency: '',
    value: 0,
  },
  dateOfConversion: '',
  rate: 0,
  currentStep: EStepConversion.CURRENCY_AMOUNT,
  amountTo: '',
  invalidDates: [],
};

const Context = createContext({} as IProps);

export function ConversionProvider({ children }: React.PropsWithChildren) {
  const [conversions, setConversions] =
    useState<IBaseValuesConversions>(initConversion);

  const handleChangeConversionsData = useCallback(
    <T extends keyof IBaseValuesConversions>(
      key: T,
      value: IBaseValuesConversions[T]
    ) => {
      setConversions((pS) => ({
        ...pS,
        [key]: value,
      }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setConversions(initConversion);
  }, []);

  const values = useMemo(
    (): IProps => ({
      invalidDates: conversions.invalidDates,
      nextDayConversionDate: conversions.nextDayConversionDate,
      amountTo: conversions.amountTo,
      buyCurrency: conversions.buyCurrency,
      dateOfConversion: conversions.dateOfConversion,
      rate: conversions.rate,
      quoteId: conversions?.quoteId,
      currentStep: conversions.currentStep,
      sellCurrency: conversions.sellCurrency,
      onChangeConversionData: handleChangeConversionsData,
      resetConversion: handleReset,
    }),
    [conversions, handleChangeConversionsData, handleReset]
  );

  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useContextConversion() {
  const context = useContext(Context);
  return context;
}

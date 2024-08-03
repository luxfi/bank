'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ICurrenciesResponse } from '@/models/balance-response';
import {
  IBeneficiaryDetailsResponse,
  IBeneficiaryListResponse,
} from '@/models/beneficiaries';
import { ICreatePaymentRequest, ITransactionDetails } from '@/models/payment';

import { API_PATHS } from '@/app/(app)/create-payment/types';
import { useAuth } from '@/store/useAuth';
import { getTransactionDetails } from '@/store/useTransactions/fetchers';
import { IWallet } from '@/store/useWallet/types';

import { useNotification } from './Notification';

export enum EStep {
  CURRENCY_BENEFICIARY = 'CURRENCY_BENEFICIARY',
  AMOUNT = 'AMOUNT',
  REASON = 'REASON',
  REVIEW_PAY = 'REVIEW_PAY',
  COMPLETE = 'COMPLETE',
}

interface ISelectedProps {
  currency?: string;
  beneficiaryId?: string;
  amount?: string;
  date?: string;
  type?: string;
  paymentReason?: string;
  paymentReference?: string;
}

interface ISelectedPropsBeneficiary
  extends Omit<ISelectedProps, 'beneficiaryId'> {
  beneficiary?: IBeneficiaryDetailsResponse;
}

interface IDataProps {
  balances: Array<IWallet>;
  currencies: Array<ICurrenciesResponse>;
  beneficiaries: Array<IBeneficiaryListResponse>;
  currentStep: EStep;
}

interface IProps {
  onChangeData<K extends keyof IDataProps>(
    field: K,
    value: IDataProps[K]
  ): void;
  onChangeSelected<S extends keyof ISelectedProps>(
    field: S,
    value: ISelectedProps[S]
  ): void;
  createPayment(): Promise<{ success: boolean; message?: any }>;
  resetPayment(): void;
  data: IDataProps;
  selected: ISelectedPropsBeneficiary;
  isLoading: boolean;
  paymentCompleted?: ITransactionDetails;
}

const Context = createContext<IProps>({} as IProps);

export function CreatePaymentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onShowNotification } = useNotification();
  const { currentUser } = useAuth();

  const [currencies, setCurrencies] = useState<Array<ICurrenciesResponse>>([]);
  const [balances, setBalances] = useState<Array<IWallet>>([]);
  const [beneficiaries, setBeneficiaries] = useState<
    Array<IBeneficiaryListResponse>
  >([]);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<IBeneficiaryDetailsResponse>();

  const [currencySelected, setCurrencySelected] = useState<string>();
  const [beneficiaryIdSelected, setBeneficiaryIdSelected] = useState<string>();
  const [amountSelected, setAmountSelected] = useState<string>();
  const [dateSelected, setDateSelected] = useState<string>();
  const [type, setType] = useState<string>();
  const [paymentReason, setPaymentReason] = useState<string>();
  const [paymentReference, setPaymentReference] = useState<string>();

  const [payment, setPayment] = useState<ITransactionDetails>();

  const [currentStep, setCurrentStep] = useState<EStep>(
    EStep.CURRENCY_BENEFICIARY
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeData = useCallback(
    <K extends keyof IDataProps>(field: K, value: IDataProps[K]) => {
      switch (field) {
        case 'balances':
          setBalances(value as Array<IWallet>);
          break;
        case 'beneficiaries':
          setBeneficiaries(value as Array<IBeneficiaryListResponse>);
          break;
        case 'currencies':
          setCurrencies(value as Array<ICurrenciesResponse>);
          break;
        case 'currentStep':
          setCurrentStep(value as EStep);
          break;

        default:
          break;
      }
    },
    []
  );

  const handleChangeSelected = useCallback(
    <S extends keyof ISelectedProps>(field: S, value: ISelectedProps[S]) => {
      switch (field) {
        case 'currency':
          setSelectedBeneficiary({} as IBeneficiaryDetailsResponse);
          setCurrencySelected(value as string);
          break;

        case 'beneficiaryId':
          setBeneficiaryIdSelected(value as string);
          break;

        case 'amount':
          setAmountSelected(value as string);
          break;

        case 'date':
          setDateSelected(value as string);
          break;

        case 'type':
          setType(value as 'priority' | 'regular');
          break;

        case 'paymentReason':
          setPaymentReason(value as string);
          break;

        case 'paymentReference':
          setPaymentReference(value as string);
          break;

        default:
          break;
      }
    },
    []
  );

  const getBeneficiariesList = useCallback(
    async (currency: string) => {
      setIsLoading(true);

      await fetch(API_PATHS.BENEFICIARY_LIST(currency))
        .then((response) => response.json())
        .then((response) => {
          handleChangeData('beneficiaries', response.data ?? []);
        })
        .catch((error) => {
          onShowNotification({
            type: 'ERROR',
            message: error.message,
            description: '',
          });
        })
        .finally(() => setIsLoading(false));
    },
    [handleChangeData, onShowNotification]
  );

  useEffect(() => {
    if (currencySelected) {
      getBeneficiariesList(currencySelected);
    }
  }, [currencySelected, getBeneficiariesList]);

  const getBeneficiaryDetails = useCallback(
    async (id: string) => {
      setIsLoading(true);
      await fetch(API_PATHS.BENEFICIARY_DETAILS(id))
        .then((response) => response.json())
        .then((response) => {
          setSelectedBeneficiary(response.data);
        })
        .catch((error) => {
          onShowNotification({
            type: 'ERROR',
            message: error.message,
            description: '',
          });
        })
        .finally(() => setIsLoading(false));
    },
    [onShowNotification]
  );

  useEffect(() => {
    if (beneficiaryIdSelected) {
      getBeneficiaryDetails(beneficiaryIdSelected);
    }
  }, [beneficiaryIdSelected, getBeneficiaryDetails]);

  const payerInformation: ICreatePaymentRequest = useMemo(
    () => ({
      accountId: currentUser?.uuid ?? '',
      amount: Number(amountSelected),
      beneficiaryId: selectedBeneficiary?.id ?? '',
      currency: selectedBeneficiary?.currency ?? '',
      date: dateSelected ?? '',
      type: type ?? '',
      reason: paymentReason ?? '',
      reference: paymentReference ?? '',
      purposeCode: '-1',
    }),
    [
      currentUser?.uuid,
      amountSelected,
      selectedBeneficiary?.id,
      selectedBeneficiary?.currency,
      dateSelected,
      type,
      paymentReason,
      paymentReference,
    ]
  );

  const makePayment = useCallback(async (): Promise<{
    success: boolean;
    message?: any;
  }> => {
    try {
      setIsLoading(true);

      const createPaymentResponse = await fetch(
        API_PATHS.CREATE_PAYMENT(payerInformation),
        {
          method: 'POST',
        }
      ).then((response) => response.json());

      if (createPaymentResponse?.statusCode !== 201) {
        setIsLoading(false);
        return {
          success: false,
          message: createPaymentResponse?.data?.messages.join(', '),
        };
      }

      const transactionDetails = await getTransactionDetails(
        createPaymentResponse.data.id
      );

      setPayment(transactionDetails);

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error };
    }
  }, [payerInformation]);

  const resetPayment = useCallback(() => {
    setCurrencies([]);
    setBalances([]);
    setBeneficiaries([]);
    setSelectedBeneficiary(undefined);

    setCurrencySelected(undefined);
    setBeneficiaryIdSelected(undefined);
    setAmountSelected(undefined);
    setDateSelected(undefined);
    setType(undefined);
    setPaymentReason(undefined);
    setPaymentReference(undefined);

    setPayment(undefined);

    setCurrentStep(EStep.CURRENCY_BENEFICIARY);
  }, []);

  const values = useMemo(
    (): IProps => ({
      onChangeData: handleChangeData,
      data: {
        balances: balances,
        beneficiaries: beneficiaries,
        currencies: currencies,
        currentStep: currentStep,
      },
      onChangeSelected: handleChangeSelected,
      createPayment: makePayment,
      resetPayment: resetPayment,
      selected: {
        currency: currencySelected,
        beneficiary: selectedBeneficiary,
        amount: amountSelected,
        date: dateSelected,
        type: type,
        paymentReason: paymentReason,
        paymentReference: paymentReference,
      },
      paymentCompleted: payment,
      isLoading,
    }),
    [
      handleChangeData,
      balances,
      beneficiaries,
      currencies,
      currentStep,
      handleChangeSelected,
      makePayment,
      resetPayment,
      currencySelected,
      selectedBeneficiary,
      amountSelected,
      dateSelected,
      type,
      paymentReason,
      paymentReference,
      payment,
      isLoading,
    ]
  );
  return <Context.Provider value={values}>{children}</Context.Provider>;
}

export function useCreatePayment() {
  return useContext(Context);
}

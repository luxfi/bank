'use client';

import { CreatePaymentProvider } from '@/context/CreatePayment';

import Steps from './Steps';

export default function Payment() {
  return (
    <CreatePaymentProvider>
      <Steps />
    </CreatePaymentProvider>
  );
}

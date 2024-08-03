'use client';

import { ConversionProvider } from '@/context/Conversions';

import Steps from './Steps';

export default function Conversion() {
  return (
    <ConversionProvider>
      <Steps />
    </ConversionProvider>
  );
}

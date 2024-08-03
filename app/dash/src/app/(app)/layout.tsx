'use client';

import { useLayoutEffect } from 'react';

import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { useCurrenciesAndCountries } from '@/store/useCurrenciesAndCountries';

import { ContentContainer, Layout, Main } from './styles';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const {
    getCurrenciesCountries,
    getCountries,
    setAllCurrencies,
    setBalances,
  } = useCurrenciesAndCountries();

  useLayoutEffect(() => {
    getCountries();
    getCurrenciesCountries();

    if (currentUser?.role !== UserRole.SuperAdmin) {
      setAllCurrencies();
      setBalances();
    }
  }, [currentUser]);

  return (
    <Layout>
      <Header />
      <Navbar />
      <Main>
        <ContentContainer>{children}</ContentContainer>
      </Main>
    </Layout>
  );
}

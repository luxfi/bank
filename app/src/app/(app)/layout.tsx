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
    <html lang="en">
      <head>
        <link rel="icon" href="/image/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00569e" />
        <meta name="description" content="CDAX Forex Control Panel" />
        <meta property="og:title" content="CDAX Forex" />
        <meta property="og:description" content="CDAX Forex Control Panel" />
        <meta
          property="og:image"
          content="https://app.cdaxforex.com/images/snapshot.png"
        />
        <meta property="og:url" content="app.cdaxforex.com" />
        <meta property="og:type" content="website" />
        <title>CDAX Forex</title>
      </head>
      <body>
        <Layout>
          <Header />
          <Navbar />
          <Main>
            <ContentContainer>{children}</ContentContainer>
          </Main>
        </Layout>
      </body>
    </html>
  );
}

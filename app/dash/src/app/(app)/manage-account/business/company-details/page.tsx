'use client';

import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { formattedDate } from '@/utils/lib';

import { CompanyType } from '@/lib/constants';

import { useAuth } from '@/store/useAuth';
import { Column, useTheme } from '@luxbank/ui';

import { HeaderDetails } from '../../components/Header';
import { ICompanyDetails } from './types';

export default function CompanyDetails() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const company = useMemo((): ICompanyDetails => {
    const companyDetails = currentUser?.currentClient.account.businessMetadata;

    return {
      name: companyDetails?.companyName ?? '',
      tradingName: companyDetails?.tradingName ?? '',
      legalEntity: companyDetails?.legalEntity ?? '',
      companyType: companyDetails?.companyType ?? '',
      regNumber: companyDetails?.companyRegistrationNumber ?? '',
      otherTradingName: companyDetails?.otherTradingNames ?? '',
      countryOfRegion: companyDetails?.countryOfRegistration ?? '',
      dateOfRegistration: companyDetails?.dateOfRegistration
        ? formattedDate(companyDetails?.dateOfRegistration, 'DD MMM YYYY')
        : '',
      dateOfIncorporation: companyDetails?.dateOfIncorporation
        ? formattedDate(companyDetails?.dateOfIncorporation, 'DD MMM YYYY')
        : '',
      taxVat: companyDetails?.vatNumber ?? '',
      otherContact: companyDetails?.otherContactInfo ?? '',
      website: companyDetails?.websiteUrl ?? '',
      statutory: companyDetails?.statutoryProvision ?? '',
      whereListed: companyDetails?.stockMarketLocation ?? '',
      publicly: companyDetails?.isPubliclyTrading ? 'Yes' : 'No',
      whyMarket: companyDetails?.stockMarket ?? '',
      nameOfRegulator: companyDetails?.regulatorName ?? '',
    };
  }, [currentUser?.currentClient.account.businessMetadata]);
  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <LabelAndValue label="Company name" value={company.name} />
          <LabelAndValue label="Trading name" value={company.tradingName} />
          <LabelAndValue label="Legal entity" value={company.legalEntity} />
          <LabelAndValue
            label="Company type"
            value={CompanyType.get(company.companyType)}
          />
          <LabelAndValue
            label="Other trading names"
            value={company.otherContact}
          />
          <LabelAndValue
            label="Country of registration"
            value={company.countryOfRegion}
          />
          <LabelAndValue label="Company reg number" value={company.regNumber} />
          <LabelAndValue
            label="Date of registration"
            value={company.dateOfRegistration}
          />
          <LabelAndValue
            label="Date of incorporation"
            value={company.dateOfIncorporation}
          />
          <LabelAndValue label="Tax/VAT number" value={company.taxVat} />
          <LabelAndValue
            label="Other contact info"
            value={company.otherContact}
          />
          <LabelAndValue label="Website" value={company.website} />
          <LabelAndValue
            label="Statutory provision under which it is incorporated"
            value={company.statutory}
          />
          <LabelAndValue label="Publicly trading" value={company.publicly} />
          <LabelAndValue label="Where listed" value={company.whereListed} />
          <LabelAndValue label="Why market" value={company.whyMarket} />
          <LabelAndValue
            label="Name of regulator"
            value={company.nameOfRegulator}
          />
        </Column>
      </Column>
    </>
  );
}

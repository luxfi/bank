'use client';

import { useRouter } from 'next/navigation';

import { LabelAndValue } from '@/components/LabelAndValue';

import { useClients } from '@/store/useClient';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import { HeaderClientsDetails } from '../../components/Header';
import { companyType } from './types';

export default function CompanyDetails() {
  const route = useRouter();

  const { theme } = useTheme();
  const { clientSelected } = useClients();

  const company = clientSelected?.businessMetadata;

  return (
    <>
      <HeaderClientsDetails />
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
          <LabelAndValue
            label="Company name"
            value={company?.companyName ?? '--'}
          />
          <LabelAndValue
            label="Company type"
            value={
              companyType.find((type) => type.value === company?.companyType)
                ?.label ?? '--'
            }
          />
          <LabelAndValue
            label="Trading name"
            value={company?.tradingName ?? '--'}
          />
          <LabelAndValue
            label="Legal entity"
            value={company?.legalEntity ?? '--'}
          />
          <LabelAndValue
            label="Other trading names"
            value={company?.otherTradingNames ?? '--'}
          />
          <LabelAndValue label="Email" value={company?.email ?? '--'} />
          <LabelAndValue
            label="Phone number"
            value={company?.telephoneNumber ?? '--'}
          />
          <LabelAndValue
            label="Country of registration"
            value={company?.countryOfRegistration ?? '--'}
          />
          <LabelAndValue
            label="Company reg number"
            value={company?.companyRegistrationNumber ?? '--'}
          />
          <LabelAndValue
            label="Tax/VAT number"
            value={company?.vatNumber ?? '--'}
          />
          <LabelAndValue
            label="Date of registration"
            value={company?.dateOfRegistration ?? '--'}
          />
          <LabelAndValue
            label="Date of incorporation"
            value={company?.dateOfIncorporation ?? '--'}
          />
          <LabelAndValue
            label="Other contact Info"
            value={company?.otherContactInfo ?? '--'}
          />
          <LabelAndValue label="Website" value={company?.websiteUrl ?? '--'} />
          <LabelAndValue
            label="Statutory provision under which it is incorporated"
            value={company?.statutoryProvision ?? '--'}
          />
          <LabelAndValue
            label="Publicly trading"
            value={company?.isPubliclyTrading ? 'Yes' : 'No'}
          />
          <LabelAndValue
            label="Where listed"
            value={company?.stockMarketLocation ?? '--'}
          />
          <LabelAndValue
            label="Which market"
            value={company?.stockMarket ?? '--'}
          />
          <LabelAndValue
            label="Name of regulator"
            value={company?.regulatorName ?? '--'}
          />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => route.push('company-details/edit')}
        />
      </Column>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import DataChangeApproval from '../../../clients/[id]/components/DataChangeApproval';
import { HeaderDetails } from '../../components/Header';
import { IEmployment } from './types';

export default function EmploymentDetails() {
  const route = useRouter();
  const { theme } = useTheme();

  const { currentUser } = useAuth();

  const employment = useMemo((): IEmployment => {
    const employmentDetails =
      currentUser?.currentClient.account.individualMetadata;
    return {
      address1: employmentDetails?.employerAddress1 ?? '',
      address2: employmentDetails?.employerAddress2 ?? '',
      address3: employmentDetails?.employerAddress3 ?? '',
      address4: '',
      name: employmentDetails?.employerName ?? '',
      occupation: employmentDetails?.occupation ?? '',
    };
  }, [currentUser?.currentClient.account.individualMetadata]);

  return (
    <>
      <HeaderDetails />
      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="employment"
          clientId={currentUser?.currentClient.uuid as string}
        />

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
          <LabelAndValue label="Occupation" value={employment.occupation} />
          <LabelAndValue label="Employer name" value={employment.name} />
          <LabelAndValue
            label="Employer Address 1"
            value={employment.address1}
          />
          <LabelAndValue
            label="Employer Address 2"
            value={employment.address2}
          />
          <LabelAndValue
            label="Employer Address 4"
            value={employment.address4}
          />
        </Column>

        {currentUser?.role !== UserRole.ViewerUser &&
          currentUser?.role !== UserRole.TeamMember && (
            <Button
              style={{ alignSelf: 'center' }}
              text="Edit"
              leftIcon="pen-2"
              roundness="rounded"
              onClick={() => route.push('employment-details/edit')}
            />
          )}
      </Column>
    </>
  );
}

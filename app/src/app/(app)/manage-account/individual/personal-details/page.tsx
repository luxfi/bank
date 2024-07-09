'use client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { UserRole } from '@/models/auth';

import { formattedDate } from '@/utils/lib';

import { useAuth } from '@/store/useAuth';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import DataChangeApproval from '../../../clients/[id]/components/DataChangeApproval';
import { HeaderDetails } from '../../components/Header';
import { IPersonDetail } from './types';

export default function PersonalDetails() {
  const route = useRouter();
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  const personDetails = useMemo((): IPersonDetail => {
    const currentClient = currentUser?.currentClient.account.individualMetadata;
    return {
      title: currentClient?.title ?? '',
      fullName: `${currentClient?.firstname} ${currentClient?.lastname}`,
      dateOfBirth: currentClient?.dateOfBirth
        ? formattedDate(currentClient?.dateOfBirth as any, 'DD MMM YYYY')
        : '',
      email: currentUser?.username ?? '',
      formerName: currentClient?.formerName ?? '',
      gender: currentClient?.gender ?? '',
      nationality: currentClient?.nationality ?? '',
      phoneNumber: currentUser?.contact?.mobileNumber ?? '',
      placeOfBirth: currentClient?.placeOfBirth ?? '',
    };
  }, [currentUser]);

  return (
    <>
      <HeaderDetails />

      <Column padding="sm" style={{ width: '100%' }}>
        <DataChangeApproval
          session="personal"
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
          <LabelAndValue label="Title" value={personDetails.title} />
          <LabelAndValue label="Full names" value={personDetails.fullName} />
          <LabelAndValue label="Former name" value={personDetails.formerName} />
          <LabelAndValue label="Email" value={personDetails.email} />
          <LabelAndValue
            label="Phone number"
            value={personDetails.phoneNumber}
          />
          <LabelAndValue
            label="Date of birth"
            value={personDetails.dateOfBirth}
          />
          <LabelAndValue
            label="Place of birth"
            value={personDetails.placeOfBirth}
          />
          <LabelAndValue
            label="Nationality"
            value={personDetails.nationality}
          />
          <LabelAndValue label="Gender" value={personDetails.gender} />
        </Column>

        {currentUser?.role !== UserRole.ViewerUser &&
          currentUser?.role !== UserRole.TeamMember && (
            <Button
              style={{ alignSelf: 'center' }}
              text="Edit"
              leftIcon="pen-2"
              roundness="rounded"
              onClick={() => route.push('personal-details/edit')}
            />
          )}
      </Column>
    </>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { LabelAndValue } from '@/components/LabelAndValue';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { Button, Column, useTheme } from '@cdaxfx/ui';

import DataChangeApproval from '../../../clients/[id]/components/DataChangeApproval';
import { HeaderDetails } from '../../components/Header';

export default function DetailsOfRegistrar() {
  const route = useRouter();
  const { theme } = useTheme();
  const { currentClientInfo, currentUser } = useAuth();

  const detailsOfRegistrar = useMemo(() => {
    return {
      fullName: currentClientInfo.ownerMetadata?.name,
      email: currentClientInfo.ownerMetadata?.email,
      phoneNumber: currentClientInfo.ownerMetadata?.metadata?.phoneNumber,
      whoTheyAre: currentClientInfo.ownerMetadata?.metadata?.whoTheyAre,
    };
  }, [currentClientInfo]);

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
          <LabelAndValue
            label="Full name"
            value={detailsOfRegistrar.fullName}
          />
          <LabelAndValue label="Email" value={detailsOfRegistrar.email} />
          <LabelAndValue
            label="Phone number"
            value={detailsOfRegistrar.phoneNumber}
          />
          <LabelAndValue
            label="Who they are"
            value={detailsOfRegistrar.whoTheyAre}
          />
        </Column>

        {currentUser?.role !== UserRole.ViewerUser &&
          currentUser?.role !== UserRole.TeamMember && (
            <Button
              style={{ alignSelf: 'center' }}
              text="Edit"
              leftIcon="pen-2"
              roundness="rounded"
              onClick={() => route.push('details-of-registrar/edit')}
            />
          )}
      </Column>
    </>
  );
}

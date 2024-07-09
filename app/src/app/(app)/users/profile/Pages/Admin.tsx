'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { LabelAndValue } from '@/components/LabelAndValue';
import { UnderlineTitle } from '@/components/UnderlineTitle';
import { UserAvatar } from '@/components/UserAvatar';

import { useAuth } from '@/store/useAuth';
import { Button, Row, Text } from '@cdaxfx/ui';

import { IGetCurrentUserV2Response, getCurrentUserV2 } from '@/api/user';

import {
  Container,
  ContainerSimpleList,
  GrayCard,
  TitleSimpleList,
} from '../../styles';

export function Admin() {
  const router = useRouter();

  const { currentUser } = useAuth();

  const [currentUserV2, setCurrentUserV2] =
    useState<IGetCurrentUserV2Response['data']>();

  const getCurrentUser = useCallback(async () => {
    if (currentUserV2) return;

    const response = await getCurrentUserV2({ cache: 'no-cache' });

    setCurrentUserV2(response.data);
  }, [currentUserV2]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (!currentUser || !currentUserV2) return null;

  return (
    <>
      <Container>
        <BackButton>
          <Text variant="headline_regular">My Profile</Text>
        </BackButton>

        <div style={{ marginTop: 40, width: 776, alignSelf: 'center' }}>
          <UserAvatar
            name={`${currentUserV2?.firstName} ${currentUserV2?.lastName}`}
            initials={
              currentUser
                ? `${currentUserV2?.firstName[0]}${currentUserV2?.lastName[0]}`
                : ''
            }
            role={currentUserV2?.role}
            showLabels
          />

          <GrayCard style={{ marginTop: 24 }}>
            {currentUserV2?.country && (
              <LabelAndValue
                label="Country"
                value={currentUserV2?.country ?? ''}
              />
            )}
            {currentUserV2?.mobileNumber && (
              <LabelAndValue
                label="Phone number"
                value={currentUserV2?.mobileNumber ?? ''}
              />
            )}
            <LabelAndValue label="Email" value={currentUserV2?.email ?? ''} />
          </GrayCard>

          <Row
            style={{ marginTop: 24, marginBottom: 40 }}
            align="center"
            justify="space-between"
          >
            <Button
              roundness="rounded"
              leftIcon="password"
              text="Change password"
              variant="tertiary"
              onClick={() => router.push('/users/profile/new-password')}
            />

            <Button
              roundness="rounded"
              leftIcon="pen-2"
              text="Edit"
              onClick={() => router.push('/users/profile/edit')}
            />
          </Row>

          <UnderlineTitle title="Linked Account" />

          {currentUser?.clients.map((clients, index) => (
            <ContainerSimpleList key={index}>
              <TitleSimpleList>{clients.name}</TitleSimpleList>
            </ContainerSimpleList>
          ))}
        </div>
      </Container>
    </>
  );
}

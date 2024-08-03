'use client';

import { useState } from 'react';

import Button from '@/components/Button';

import { useAuth } from '@/store/useAuth';

import { defaultTheme } from '@/styles/themes/default';

import {
  ContainerAdmin,
  ContainersDataGridAdmin,
  SimpleContainerGrid,
  Text,
  Title,
} from '../styled';
import Address from './Address';
import BankAccountDetail from './BankAccountDetail';
import EmploymentDetail from './Employment';
import ID from './ID';
import ModalResetPassword from './Modals/ResetPassword';
import Other from './Other';
import PersonalDetails from './PersonalDetails';

export default function SuperAdmin() {
  const { currentUser } = useAuth();

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  return (
    <>
      <ContainerAdmin>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SimpleContainerGrid>
            <Title style={{ textAlign: 'start' }}>Full Name:</Title>
            <Text>{`${currentUser?.firstname} ${currentUser?.lastname}`}</Text>
            <Title style={{ textAlign: 'start' }}>Account Type:</Title>
            <Text>{`${
              currentUser?.currentClient?.account?.entityType ?? ''
            }`}</Text>
          </SimpleContainerGrid>

          <Button
            onClick={() => setModalIsVisible(true)}
            style={{ width: 224 }}
            color={defaultTheme.colors.secondary}
          >
            Reset Password
          </Button>
        </div>

        <ContainersDataGridAdmin>
          <PersonalDetails />

          <Address />

          <EmploymentDetail />

          <BankAccountDetail />

          <Other />

          <ID />
        </ContainersDataGridAdmin>
      </ContainerAdmin>

      {currentUser && (
        <ModalResetPassword
          onCloseModal={() => setModalIsVisible(false)}
          openModal={modalIsVisible}
        />
      )}
    </>
  );
}

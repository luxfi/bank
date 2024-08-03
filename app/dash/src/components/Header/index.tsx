'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ICurrentUser, UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { Icon, Row, Text, useTheme, Button as ButtonDS } from '@luxbank/ui/';
import { Avatar } from 'antd';

import { defaultTheme } from '@/styles/themes/default';

import Button from '../Button';
import ClientSelector from '../ClientSelector';
import { Tooltip } from '../Tooltip';
import { ButtonsContainer, Container, Logo } from './styles';

export default function Header() {
  const { currentUser, setReturnWithSuperAdminUser } = useAuth();
  const { theme } = useTheme();
  const [currentUserState, setCurrentUserState] = useState<ICurrentUser | null>(
    null
  );

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setCurrentUserState(currentUser);
    }
  }, [currentUser]);

  const ProfileBtn = () => (
    <Avatar
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        backgroundColor: 'transparent',
      }}
      icon={<Icon variant="settings" />}
    />
  );

  return (
    <Container
      $backgroundColor={
        currentUser?.role === UserRole.SuperAdmin ||
        (currentUser?.role === UserRole.AdminUser && currentUser?.personatedBy)
          ? theme.backgroundColor.layout['container-emphasized-primary'].value
          : theme.backgroundColor.layout['container-L1'].value
      }
    >
      <Link href={'/'}>
        <Logo
          src={
            currentUser?.role === UserRole.SuperAdmin ||
            (currentUser?.role === UserRole.AdminUser &&
              currentUser?.personatedBy)
              ? '/image/cdax-logo2.svg'
              : '/image/cdax-logo.svg'
          }
          width={130}
          height={32}
          priority
          alt="CDAX Forex"
        />
      </Link>

      <ButtonsContainer>
        {currentUser?.role !== UserRole.SuperAdmin &&
          !currentUser?.personatedBy && <ClientSelector />}

        {currentUser?.role !== UserRole.SuperAdmin &&
        !currentUser?.personatedBy ? (
          <Tooltip
            placement="bottom"
            title={!currentUserState ? 'Login' : 'Manage Account'}
          >
            <Link href={'/manage-account'}>
              <ProfileBtn />
            </Link>
          </Tooltip>
        ) : (
          <Row align="center">
            {currentUser?.personatedBy && (
              <>
                <Text
                  style={{ marginRight: 8 }}
                  variant="body_md_regular"
                  color={'#fff'}
                >
                  {currentUser?.currentClient?.name}
                </Text>
                <Text
                  style={{ marginRight: 8, opacity: 0.7 }}
                  variant="body_sm_regular"
                  color={'#fff'}
                >
                  {currentUser?.currentClient?.account?.entityType ?? ''}
                </Text>

                <Text
                  style={{ marginInline: 8, fontSize: 24, marginBottom: 6 }}
                  color={'#fff'}
                  variant="body_md_semibold"
                >
                  {'|'}
                </Text>
              </>
            )}
            <Text
              style={{ marginRight: 8 }}
              variant="body_md_regular"
              color={'#fff'}
            >
              CDAX Team
            </Text>

            {currentUser?.personatedBy && (
              <Row gap="sm" align="center">
                <Tooltip
                  placement="bottom"
                  title={`All actions performed on the customer's account will be attributed to the CDAX Team, and will be recorded in the transaction information`}
                >
                  <div>
                    <Icon
                      style={{ cursor: 'default' }}
                      variant="info-circle"
                      color="#fff"
                    />
                  </div>
                </Tooltip>

                <ButtonDS
                  roundness="rounded"
                  leftIcon="logout-1"
                  text="Go back"
                  onClick={() => {
                    setReturnWithSuperAdminUser();
                    if (path === '/dashboard') {
                      window.location.reload();
                      return;
                    }
                    router.push('/dashboard');
                  }}
                />
              </Row>
            )}
          </Row>
        )}

        {!currentUserState && path !== '/' && (
          <Button
            color={defaultTheme.colors.primary}
            style={{ padding: '0 3rem' }}
            onClick={() => router.push('/')}
          >
            Login
          </Button>
        )}
      </ButtonsContainer>
    </Container>
  );
}

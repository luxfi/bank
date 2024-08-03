'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Lottie from 'react-lottie';

import loadingTable from '@/animations/loadingTable.json';
import { useAuth } from '@/store/useAuth';
import { Column, Text } from '@luxbank/ui';

import { ButtonMenu, Container, Content, Details, Menu } from './styles';

interface IProps {
  children: React.ReactNode;
}

const individualRoutes = [
  { label: 'Personal details', value: 'individual/personal-details' },
  { label: 'Address', value: 'individual/address' },
  { label: 'Employment details', value: 'individual/employment-details' },
  { label: 'Bank Account details', value: 'individual/bank-account-details' },
  { label: 'Other', value: 'individual/other' },
  //{ label: 'Documents', value: 'individual/documents' },
];

const businessRoutes = [
  { label: 'Details of registrar', value: 'business/details-of-registrar' },
  { label: 'Company details', value: 'business/company-details' },
  { label: 'Address', value: 'business/address' },
  { label: 'Expected activity', value: 'business/expected-activity' },
  { label: 'Bank account details', value: 'business/bank-account-details' },
  //{ label: 'Documents', value: 'business/documents' },
];

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingTable,
};

export default function ManageAccountLayout({ children }: IProps) {
  const path = usePathname();
  const { currentUser } = useAuth();
  const { push: navigate } = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const accountType = useMemo(
    // () => 'business',
    () => currentUser?.currentClient.account.entityType,
    [currentUser?.currentClient]
  );

  const checkRoutes = useCallback(() => {
    const executeRedirect: Record<string, () => void> = {
      individual: () => navigate('/manage-account/individual/personal-details'),
      business: () => navigate('/manage-account/business/details-of-registrar'),
    };

    if (accountType && !path.split('/').includes(accountType)) {
      executeRedirect[accountType]();
      return setIsLoading(false);
    }
    setIsLoading(false);
  }, [accountType, navigate, path]);

  useEffect(() => {
    if (accountType) checkRoutes();
  }, [accountType]);

  const routes = useMemo(() => {
    return accountType === 'individual' ? individualRoutes : businessRoutes;
  }, [accountType]);

  const activeRoute = useMemo(() => {
    return routes.find((route) =>
      path.split('/').includes(route.value.split('/')?.[1])
    )?.value;
  }, [path, routes]);

  if (isLoading)
    return (
      <Column gap="xxxs" width="100%" align="center" justify="center">
        <Lottie options={animationOptions} width={110} />
      </Column>
    );

  return (
    <Container>
      <Text variant="headline_regular">Manage Account</Text>
      <Content>
        <Menu>
          {routes.map((route) => (
            <ButtonMenu
              key={route.value}
              isActive={route.value === activeRoute}
              onClick={() => navigate(`/manage-account/${route.value}`)}
            >
              {route.label}
            </ButtonMenu>
          ))}
        </Menu>
        <Details>{children}</Details>
      </Content>
    </Container>
  );
}

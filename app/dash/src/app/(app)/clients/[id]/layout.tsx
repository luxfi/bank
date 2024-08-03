'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import Lottie from 'react-lottie';

import { Divider } from '@/components/Divider';

import { useNotification } from '@/context/Notification';

import loadingTable from '@/animations/loadingTable.json';
import { useClients } from '@/store/useClient';
import { EnumClientDocumentType } from '@/store/useDocuments/types';
import { useUsers } from '@/store/useUsers';
import { Column, Text } from '@luxbank/ui';

import {
  ButtonMenu,
  Container,
  Content,
  Details,
  DotRequired,
  Menu,
} from './styles';

interface IProps {
  children: React.ReactNode;
}

const businessRoutes = [
  { label: 'Details of registrar', value: 'business/details-of-registrar' },
  { label: 'Risk assessment', value: 'business/risk-assessment' },
  { label: 'Documents', value: 'business/documents' },
  { label: 'Linked users', value: 'business/linked-users' },
  { label: 'Company details', value: 'business/company-details' },
  { label: 'Addresses', value: 'business/address' },
  { label: 'Director', value: 'business/director' },
  { label: 'Shareholders', value: 'business/shareholders' },
  { label: 'Expected activity', value: 'business/expected-activity' },
  { label: 'Bank account details', value: 'business/bank-account-details' },
  { label: 'Broker', value: 'business/broker' },
];

const individualRoutes = [
  { label: 'Personal details', value: 'individual/personal-details' },
  { label: 'Risk assessment', value: 'individual/risk-assessment' },
  { label: 'Documents', value: 'individual/documents' },
  { label: 'Linked users', value: 'individual/linked-users' },
  { label: 'Address', value: 'individual/address' },
  { label: 'Employment details', value: 'individual/employment-details' },
  { label: 'Bank account details', value: 'individual/bank-account-details' },
  { label: 'Other', value: 'individual/other' },
  { label: 'ID', value: 'individual/id' },
  { label: 'Broker', value: 'individual/broker' },
];

const commonRoutes = (clientId?: string, accountId?: string) => [
  { label: 'Users', value: `common/users?client=${clientId}` },
  {
    label: 'Beneficiaries',
    value: `common/beneficiaries?client=${clientId}&account=${accountId}`,
  },
  { label: 'Transactions', value: `common/transactions?client=${clientId}` },
];

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingTable,
};

export default function ClientDetailsLayout({ children }: IProps) {
  const path = usePathname();
  const { id }: { id: string } = useParams();

  const {
    clientSelected,
    getClientsInfo,
    isLoading,
    masterClientSelected,
    setMasterClientSelected,
  } = useClients();

  const { getUserClientById } = useUsers();

  const { push: navigate } = useRouter();
  const { onShowNotification } = useNotification();

  const baseIds = useMemo(() => {
    const splitIds = decodeURIComponent(id).split(':');
    return {
      clientId: splitIds?.[0] ?? '',
      masterId: splitIds?.[1] ?? '',
    };
  }, [id]);

  const basePath = useMemo(
    () => `/clients/${baseIds.clientId}:${baseIds.masterId}/`,
    [baseIds]
  );

  const redirectClients = () => {
    return navigate('/clients');
  };

  useEffect(() => {
    if (!baseIds) redirectClients();

    getClientsInfo(baseIds.clientId).catch(() => {
      onShowNotification({
        description: 'Unable to get customer',
        message: 'Error!',
        type: 'ERROR',
      });

      redirectClients();
    });

    getUserClientById(baseIds.masterId)
      .then((response) => {
        setMasterClientSelected(response);
      })
      .catch(() => {
        onShowNotification({
          description: 'Unable to get customer',
          message: 'Error!',
          type: 'ERROR',
        });

        redirectClients();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseIds]);

  const accountType = useMemo(
    () => (clientSelected?.individualMetadata ? 'individual' : 'business'),
    [clientSelected]
  );

  const checkRoutes = useCallback(() => {
    const executeRedirect: Record<string, () => void> = {
      individual: () => navigate(`${basePath}/individual/personal-details`),
      business: () => navigate(`${basePath}/business/details-of-registrar`),
    };

    if (accountType && !path.split('/').includes(accountType)) {
      return executeRedirect[accountType]();
    }
  }, [accountType, navigate, path, basePath]);

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

  const checkRequired = (route: string): boolean => {
    const detailsOfRegistrar: boolean =
      !masterClientSelected?.firstname ||
      !masterClientSelected?.lastname ||
      !masterClientSelected?.contact?.mobileNumber;

    const personalDetails: boolean =
      (!clientSelected?.individualMetadata?.firstname &&
        !clientSelected?.individualMetadata?.lastname) ||
      !clientSelected?.individualMetadata?.title ||
      !clientSelected?.individualMetadata?.dateOfBirth ||
      !clientSelected?.individualMetadata?.nationality ||
      !clientSelected?.individualMetadata?.country;

    const riskAssessment: boolean = !clientSelected?.riskAssessment;

    //check if client has required documents
    const hasIdentityDocument: boolean = !!clientSelected?.documents.find(
      (d) => d.type === EnumClientDocumentType.IdentityDocument
    );
    const hasResidentialAddress: boolean = !!clientSelected?.documents.find(
      (d) => d.type === EnumClientDocumentType.ResidentialAddressVerification
    );
    //show dot if is missing required documents
    const documents: boolean = !hasIdentityDocument || !hasResidentialAddress;

    const individualMetadata = clientSelected?.individualMetadata;
    const businessMetadata = clientSelected?.businessMetadata;
    const addresses: boolean = individualMetadata
      ? !individualMetadata?.addressLine1 ||
        !individualMetadata?.postcode ||
        !individualMetadata?.city ||
        !individualMetadata?.state
      : !businessMetadata?.address1;

    const employmentDetails: boolean =
      !clientSelected?.individualMetadata?.employerAddress1;

    const bankAccountDetails: boolean =
      !clientSelected?.bankMetadata?.accountHolderName ||
      !clientSelected?.bankMetadata?.bankCountry ||
      !clientSelected?.bankMetadata?.bankName ||
      !(
        (clientSelected?.bankMetadata?.IBAN &&
          clientSelected?.bankMetadata?.bicSwift) ||
        (clientSelected?.bankMetadata?.sortCode &&
          clientSelected?.bankMetadata?.accountNumber)
      ) ||
      !clientSelected?.bankMetadata?.currency;

    const companyDetails: boolean =
      !clientSelected?.businessMetadata?.companyName ||
      !clientSelected?.businessMetadata?.companyType ||
      !clientSelected?.businessMetadata?.tradingName ||
      !clientSelected?.businessMetadata?.legalEntity ||
      !clientSelected?.businessMetadata?.email ||
      !clientSelected?.businessMetadata?.countryOfRegistration ||
      !clientSelected?.businessMetadata?.companyRegistrationNumber ||
      !clientSelected?.businessMetadata?.vatNumber ||
      !clientSelected?.businessMetadata?.websiteUrl ||
      !clientSelected?.businessMetadata?.statutoryProvision ||
      !clientSelected?.businessMetadata?.regulatorName ||
      !clientSelected?.businessMetadata?.stockMarket;

    const id: boolean =
      !clientSelected?.individualMetadata?.identificationNumber ||
      !clientSelected?.individualMetadata?.identificationType;

    const director: boolean = !(
      !!clientSelected?.directors && clientSelected?.directors?.length > 0
    );

    const shareholder: boolean = !(
      !!clientSelected?.shareholders && clientSelected?.shareholders?.length > 0
    );

    const expectedActivity: boolean =
      !clientSelected?.businessMetadata?.expectedActivity ||
      !clientSelected?.businessMetadata?.expectedVolume;

    const routes: Record<string, boolean> = {
      'Details of registrar': detailsOfRegistrar,
      'Personal details': personalDetails,
      'Risk assessment': riskAssessment,
      'Employment details': employmentDetails,
      'Expected activity': expectedActivity,
      Director: director,
      Shareholders: shareholder,
      ID: id,
      Documents: documents,
      'Company details': companyDetails,
      Address: addresses,
      Addresses: addresses,
      'Bank account details': bankAccountDetails,
    };

    return routes[route] ?? false;
  };

  if (!masterClientSelected || isLoading || !clientSelected)
    return (
      <Column gap="xxxs" width="100%" align="center" justify="center">
        <Lottie options={animationOptions} width={110} />
      </Column>
    );

  return (
    <Container>
      <Text variant="headline_regular">Client Details</Text>
      <Content>
        <Menu>
          {routes.map((route) => (
            <ButtonMenu
              key={route.value}
              $isActive={route.value === activeRoute}
              onClick={() => navigate(`${basePath}/${route.value}`)}
            >
              {route.label}
              {checkRequired(route.label) && <DotRequired />}
            </ButtonMenu>
          ))}

          <Divider orientation="horizontal" styles={{ marginBlock: 16 }} />

          {commonRoutes(baseIds.clientId, clientSelected?.accountUuid).map(
            (route) => (
              <ButtonMenu
                key={route.value}
                $isActive={route.value === activeRoute}
                onClick={() => navigate(`${basePath}/${route.value}`)}
              >
                {route.label}
              </ButtonMenu>
            )
          )}
        </Menu>
        <Details>{children}</Details>
      </Content>
    </Container>
  );
}

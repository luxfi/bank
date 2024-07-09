'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/Badge';
import { LabelAndValue } from '@/components/LabelAndValue';

import { EnumGateway } from '@/models/gateway';

import { useMessages } from '@/context/Messages';

import { useClients } from '@/store/useClient';
import {
  Button,
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import DataChangeApproval from '../../components/DataChangeApproval';
import { HeaderClientsDetails } from '../../components/Header';
import { ModalDocumentsLinkAccount } from '../../components/ModalDocumentsLinkAccount';
import { ModalDownloadDocumentsLinkAccount } from '../../components/ModalDownloadDocumentsLinkAccount';
import { IDetailsOfRegistrar } from './types';

export default function DetailsOfRegistrar() {
  const route = useRouter();

  const { masterClientSelected, clientSelected, sendWelcomeEmail } =
    useClients();
  const { onShowMessage } = useMessages();

  const { theme } = useTheme();

  const [modalDownloadDocumentIsVisible, setModalDownloadDocumentIsVisible] =
    useState(false);
  const [modalDocumentIsVisible, setModalDocumentIsVisible] = useState(false);

  const detailsOfRegistrar = useMemo((): IDetailsOfRegistrar => {
    return {
      firstName: masterClientSelected?.firstname ?? '',
      lastName: masterClientSelected?.lastname ?? '',
      email: masterClientSelected?.username ?? '',
      phoneNumber: masterClientSelected?.contact?.mobileNumber ?? '',
      whoTheyAre: masterClientSelected?.contact?.businessRole ?? '',
    };
  }, [masterClientSelected]);

  const linkAccountIsVisible = useMemo(() => {
    const documents: boolean =
      !!clientSelected?.documents?.length &&
      clientSelected?.documents?.length > 0;

    const detailsOfRegistrar: boolean = !(
      !clientSelected?.businessMetadata?.companyName ||
      !clientSelected?.businessMetadata?.telephoneNumber
    );

    const director: boolean =
      !!clientSelected?.directors && clientSelected?.directors?.length > 0;

    const shareholder: boolean =
      !!clientSelected?.shareholders &&
      clientSelected?.shareholders?.length > 0;

    const addresses: boolean = !(
      !clientSelected?.businessMetadata?.address1 ||
      !clientSelected?.businessMetadata?.registeredOffice1_postcode ||
      !clientSelected?.businessMetadata?.registeredOffice1_state ||
      !clientSelected?.businessMetadata?.registeredOffice1_city
    );

    const expectedActivity: boolean = !(
      !clientSelected?.businessMetadata?.expectedActivity ||
      !clientSelected?.businessMetadata?.expectedVolume
    );

    const bankAccountDetails: boolean = !(
      !clientSelected?.bankMetadata?.accountHolderName ||
      !clientSelected?.bankMetadata?.bankCountry ||
      !clientSelected?.bankMetadata?.bankName ||
      !(
        (clientSelected?.bankMetadata?.IBAN &&
          clientSelected?.bankMetadata?.bicSwift) ||
        (clientSelected?.bankMetadata?.sortCode &&
          clientSelected?.bankMetadata?.accountNumber)
      )
    );

    const companyDetails: boolean = !(
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
      !clientSelected?.businessMetadata?.stockMarket
    );

    return (
      documents &&
      addresses &&
      director &&
      shareholder &&
      expectedActivity &&
      detailsOfRegistrar &&
      bankAccountDetails &&
      companyDetails &&
      !clientSelected?.linkedClient
    );
  }, [clientSelected]);

  const handleSendWelcomeEmail = useCallback(() => {
    onShowMessage({
      type: 'question',
      title:
        'Are you sure you want to send an email informing that the account has been created?',
      description: '',
      isVisible: true,
      textButtonConfirm: 'Send email',
      textButtonCancel: 'No',
      onConfirm: async () => {
        try {
          await sendWelcomeEmail({ uuid: clientSelected?.uuid as string });

          onShowMessage({
            type: 'message',
            status: 'success',
            title: 'Email sent successfully.',
            description: '',
            isVisible: true,
          });
        } catch {
          onShowMessage({
            type: 'message',
            status: 'fail',
            title: 'Error sending email.',
            description: '',
            isVisible: true,
          });
        }
      },
    });
  }, [clientSelected?.uuid, onShowMessage, sendWelcomeEmail]);

  return (
    <>
      <HeaderClientsDetails />

      <Column padding="sm" gap="sm" style={{ width: '100%' }}>
        <Column gap="xxxs" style={{ marginLeft: 10 }}>
          <Text
            variant="caption_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Politically Exposed Person (PEP)`}</Text>
          {clientSelected?.riskAssessment?.pep === 'Yes' ? (
            <Badge label="Yes" variant="negative" />
          ) : (
            <Badge label="No" variant="positive" />
          )}
        </Column>

        <Column gap="xxxs" style={{ marginLeft: 10 }}>
          <Text
            variant="caption_regular"
            color={theme.textColor.layout.secondary.value}
          >{`Linked Client:`}</Text>
          <Text
            variant={
              !clientSelected?.linkedClient ? 'body_md_regular' : 'body_md_bold'
            }
            color={
              clientSelected?.linkedClient
                ? theme.textColor.layout.primary.value
                : theme.textColor.interactive.disabled.value
            }
          >{`${
            clientSelected?.linkedClient
              ? EnumGateway[clientSelected.linkedClient]
              : 'Unlinked'
          } `}</Text>
        </Column>

        {linkAccountIsVisible ? (
          <Row gap="sm" align="center" style={{ marginLeft: 10 }}>
            <Text variant="body_md_regular">
              To link this account to the payment gateway please click this
              button
            </Text>
            <Button
              text="Link Account"
              leftIcon="link"
              roundness="rounded"
              variant="primary"
              size="small"
              onClick={() =>
                onShowMessage({
                  type: 'question',
                  title: 'Warning',
                  description:
                    "This client's documents still need to be verified. Do you still wish to approve the client without verifying documents?",
                  isVisible: true,
                  textButtonConfirm: 'Ignore and Link',
                  textButtonCancel: 'View Documents',
                  onConfirm: () => setModalDocumentIsVisible(true),
                  onCancel: () => {
                    setModalDownloadDocumentIsVisible(true);
                  },
                })
              }
            />
          </Row>
        ) : (
          <>
            {!clientSelected?.riskAssessment &&
              !clientSelected?.linkedClient && (
                <Row
                  align="center"
                  justify="center"
                  width="100%"
                  height="32px"
                  gap="xs"
                  style={{
                    backgroundColor:
                      theme.backgroundColor.feedback.negative.value,
                  }}
                >
                  <Text
                    variant="body_md_regular"
                    color={theme.textColor.feedback['text-negative'].value}
                  >
                    Please fill risk assessment pending information before
                    linking the client.
                  </Text>
                  <Icon
                    size="sm"
                    variant="danger-triangle"
                    color={theme.textColor.feedback['text-negative'].value}
                  />
                </Row>
              )}
          </>
        )}

        <DataChangeApproval
          session="personal"
          clientId={clientSelected?.uuid as string}
        />

        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
          }}
        >
          <LabelAndValue
            label="First name"
            value={detailsOfRegistrar.firstName}
          />
          <LabelAndValue
            label="Last name"
            value={detailsOfRegistrar.lastName}
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
        <Column gap="sm">
          <Button
            roundness="rounded"
            variant="tertiary"
            leftIcon="password"
            text="Change password"
            size="small"
            onClick={() => route.push('change-password')}
          />
          <Button
            roundness="rounded"
            variant="tertiary"
            leftIcon="password"
            text="Send welcome email"
            size="small"
            onClick={handleSendWelcomeEmail}
          />
        </Column>

        <Button
          style={{ alignSelf: 'center' }}
          text="Edit"
          roundness="rounded"
          onClick={() => route.push('details-of-registrar/edit')}
        />
      </Column>

      <ModalDownloadDocumentsLinkAccount
        isVisible={modalDownloadDocumentIsVisible}
        onClose={() => setModalDownloadDocumentIsVisible(false)}
      />

      <ModalDocumentsLinkAccount
        isVisible={modalDocumentIsVisible}
        onClose={() => setModalDocumentIsVisible(false)}
      />
    </>
  );
}

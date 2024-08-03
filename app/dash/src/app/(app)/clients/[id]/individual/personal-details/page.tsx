'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { Badge } from '@/components/Badge';
import { LabelAndValue } from '@/components/LabelAndValue';

import { EnumGateway } from '@/models/gateway';

import { useMessages } from '@/context/Messages';

import { formattedDate } from '@/utils/lib';

import { useClients } from '@/store/useClient';
import { Button, Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';

import DataChangeApproval from '../../components/DataChangeApproval';
import { HeaderClientsDetails } from '../../components/Header';
import { ModalDocumentsLinkAccount } from '../../components/ModalDocumentsLinkAccount';
import { ModalDownloadDocumentsLinkAccount } from '../../components/ModalDownloadDocumentsLinkAccount';
import { IPersonDetail } from './types';

export default function PersonalDetails() {
  const router = useRouter();
  const { onShowMessage } = useMessages();

  const [modalDownloadDocumentIsVisible, setModalDownloadDocumentIsVisible] =
    useState(false);
  const [modalDocumentIsVisible, setModalDocumentIsVisible] = useState(false);

  const { theme } = useTheme();
  const { clientSelected, masterClientSelected, sendWelcomeEmail } =
    useClients();

  const personDetails = useMemo((): IPersonDetail => {
    const client = clientSelected?.individualMetadata;

    return {
      title: client?.title ?? '',
      fullName: `${client?.firstname} ${client?.lastname}`,
      otherNames: `${client?.otherName ?? ''}`,
      dateOfBirth: client?.dateOfBirth
        ? formattedDate(client?.dateOfBirth, 'DD MMM YYYY')
        : '',
      email: masterClientSelected?.username ?? '',
      formerName: client?.formerName ?? '',
      emailVerify: masterClientSelected?.verifiedAt ? 'Yes' : 'No',
      gender: client?.gender ?? '',
      nationality: client?.nationality ?? '',
      phoneNumber: masterClientSelected?.contact?.mobileNumber ?? '',
      country: client?.country ?? '',
      placeOfBirth: client?.placeOfBirth ?? '',
    };
  }, [
    clientSelected?.individualMetadata,
    masterClientSelected?.contact?.mobileNumber,
    masterClientSelected?.username,
    masterClientSelected?.verifiedAt,
  ]);

  const linkAccountIsVisible = useMemo(() => {
    const documents: boolean =
      !!clientSelected?.documents?.length &&
      clientSelected?.documents?.length > 0;

    const addresses: boolean = !(
      !clientSelected?.individualMetadata?.addressLine1 ||
      !clientSelected?.individualMetadata?.postcode ||
      !clientSelected?.individualMetadata?.city ||
      !clientSelected?.individualMetadata?.state ||
      !clientSelected?.individualMetadata?.country
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

    const personalDetails: boolean = !(
      !clientSelected?.individualMetadata?.firstname ||
      !clientSelected?.individualMetadata?.lastname ||
      !clientSelected?.individualMetadata?.formerName ||
      !clientSelected?.individualMetadata?.title
    );

    const ID: boolean = !(
      !clientSelected?.individualMetadata?.identificationNumber ||
      !clientSelected?.individualMetadata?.identificationType
    );

    return (
      documents &&
      addresses &&
      bankAccountDetails &&
      personalDetails &&
      ID &&
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
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <LabelAndValue label="Title" value={personDetails.title} />
          <LabelAndValue label="Full name" value={personDetails.fullName} />
          <LabelAndValue label="Former name" value={personDetails.formerName} />
          <LabelAndValue label="Other name" value={personDetails.otherNames} />
          <LabelAndValue
            label="Date of birth"
            value={personDetails.dateOfBirth}
          />
          <LabelAndValue
            label="Place of birth"
            value={personDetails.placeOfBirth}
          />
          <LabelAndValue label="Email" value={personDetails.email} />
          <LabelAndValue
            label="Email verified"
            value={personDetails.emailVerify}
          />
          <LabelAndValue
            label="Phone number"
            value={personDetails.phoneNumber}
          />
          <LabelAndValue
            label="Nationality"
            value={personDetails.nationality}
          />
          <LabelAndValue label="Country" value={personDetails.country} />
          <LabelAndValue label="Gender" value={personDetails.gender} />
        </Column>

        <Column gap="sm">
          <Button
            roundness="rounded"
            variant="tertiary"
            leftIcon="password"
            text="Change Password"
            size="small"
            onClick={() => router.push('change-password')}
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
          leftIcon="pen-2"
          roundness="rounded"
          onClick={() => router.push('personal-details/edit')}
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

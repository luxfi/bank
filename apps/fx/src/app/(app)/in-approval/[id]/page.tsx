'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Badge } from '@/components/Badge';
import Input from '@/components/Input';
import { Loading } from '@/components/Loading';
import ModalResult from '@/components/ModalResult';
import { PaymentReviewCard } from '@/components/ReviewCards/paymentCard';

import { SuperOrAdminOrManager, UserRole } from '@/models/auth';
import { ITransactionDetails } from '@/models/payment';

import { useNotification } from '@/context/Notification';

import { formatCurrency } from '@/utils/lib';
import { getBadgeStatusValues } from '@/utils/valueMaps';

import { APP_PATHS } from '@/app/paths';
import { useAuth } from '@/store/useAuth';
import { useTransactions } from '@/store/useTransactions';
import {
  Button,
  Column,
  Icon,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import { Modal } from 'antd';

import { Container, ContentContainer, DisclaimerContainer } from './styles';

interface IPendingPaymentProps {
  params: {
    id: string;
  };
}

export default function PendingPayment({ params }: IPendingPaymentProps) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { onShowNotification } = useNotification();
  const {
    approveTransaction,
    rejectTransaction,
    getSelectedTransaction,
    errors,
    loading,
    setApprovalCount,
  } = useTransactions();

  const router = useRouter();

  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [openDenyModal, setOpenDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionDetails>({} as ITransactionDetails);

  const [resultModalValues, setResultModalValues] = useState({
    type: 'SUCCESS',
    title: '',
    subtitle: '',
    isVisible: false,
    footer: () => <></>,
  });

  const fetchPayment = async () => {
    await getSelectedTransaction(params.id).then((data) => {
      setSelectedTransaction(data);
    });
  };

  useEffect(() => {
    fetchPayment();
  }, []);

  useEffect(() => {
    if (errors.getSelectedTransaction) {
      onShowNotification({
        type: 'ERROR',
        message: 'Error',
        description: errors.getSelectedTransaction,
      });
    }
  }, [errors.getSelectedTransaction, onShowNotification]);

  const showActionsButtons = useMemo(() => {
    if (!currentUser) return false;
    const conditions = [
      !loading.getSelectedTransaction,
      SuperOrAdminOrManager.includes(currentUser.role),
      selectedTransaction?.status === 'pending',
    ];
    return conditions.every((v) => v === true);
  }, [loading.getSelectedTransaction, currentUser, selectedTransaction]);

  const handleDeny = async () => {
    if (!params.id) return;
    setOpenDenyModal(false);

    await rejectTransaction({ id: params.id, reason: denyReason })
      .then(async () => {
        await fetchPayment();
        setApprovalCount();
      })
      .then(() => {
        setOpenDenyModal(false);
        setResultModalValues(failureModalValues);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      });
  };

  const handleApprove = async () => {
    if (!params.id) return;
    setOpenApprovalModal(false);

    await approveTransaction(params.id)
      .then(async () => {
        await fetchPayment();
        setApprovalCount();
      })
      .then(() => {
        setOpenApprovalModal(false);
        setResultModalValues(successtModalValues);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      });
  };

  const successtModalValues = {
    type: 'SUCCESS',
    title: 'Your payment was Successfully created!',
    subtitle: `Great, the payment of ${formatCurrency(
      Number(selectedTransaction?.out?.amount)
    )} ${selectedTransaction?.out?.currency} to ${
      selectedTransaction?.payment?.beneficiary?.name || '-'
    } has been successfully created and sent for processing!`,
    isVisible: true,
    footer: () => (
      <Row gap="xs">
        <Button
          roundness="rounded"
          text="Processing transaction"
          onClick={() => router.push(APP_PATHS.TRANSACTIONS.ROOT)}
        />
        <Button
          roundness="rounded"
          text="Continue reviewing payments"
          onClick={() => router.push(APP_PATHS.IN_APPROVAL.ROOT)}
        />
      </Row>
    ),
  };

  const failureModalValues = {
    type: 'FAIL',
    title: 'The payment was rejected!',
    subtitle: `The payment of ${formatCurrency(
      Number(selectedTransaction?.out?.amount)
    )} ${selectedTransaction?.out?.currency} to ${
      selectedTransaction?.payment?.beneficiary?.name || '-'
    } was rejected!`,
    isVisible: true,
    footer: () => (
      <Row gap="xs" align="center" justify="center" width="100%">
        <Button
          text="View details"
          roundness="rounded"
          onClick={() => {
            setResultModalValues((p) => ({
              ...p,
              isVisible: false,
            }));
          }}
        />
        <Button
          roundness="rounded"
          text="Continue reviewing payments"
          onClick={() => router.push(APP_PATHS.IN_APPROVAL.ROOT)}
        />
      </Row>
    ),
  };

  return (
    <Container>
      <BackButton>Payment</BackButton>

      <ContentContainer>
        {loading.getSelectedTransaction && (
          <Column justify="center" align="center" height="100%">
            <Loading />
          </Column>
        )}
        {!loading.getSelectedTransaction && (
          <Column width="640px" gap="md">
            <DisclaimerContainer>
              <Row justify="space-between" align="center">
                <Row gap="xxs" align="center">
                  <Icon
                    variant="exclamation-square"
                    color={theme.textColor.feedback['text-warning'].value}
                  />
                  {selectedTransaction?.status === 'pending' && (
                    <Text
                      variant="body_sm_regular"
                      color={theme.textColor.feedback['text-warning'].value}
                    >
                      This transaction requires approval.
                    </Text>
                  )}
                  {selectedTransaction?.status === 'expired' && (
                    <Text
                      variant="body_sm_regular"
                      color={theme.textColor.feedback['text-warning'].value}
                    >
                      This approval has been expired
                    </Text>
                  )}
                </Row>
                {selectedTransaction?.status && (
                  <Badge
                    label={
                      getBadgeStatusValues[selectedTransaction?.status]?.label
                    }
                    variant={
                      getBadgeStatusValues[selectedTransaction?.status]?.variant
                    }
                    icon={
                      getBadgeStatusValues[selectedTransaction?.status]?.icon
                    }
                  />
                )}
              </Row>

              {showActionsButtons &&
                currentUser?.role !== UserRole.ViewerUser && (
                  <Row gap="xs" width="100%">
                    <Button
                      text="Reject Payment"
                      variant="secondary"
                      roundness="rounded"
                      style={{ width: '100%' }}
                      onClick={() => setOpenDenyModal(true)}
                    />
                    <Button
                      text="Approve Payment"
                      roundness="rounded"
                      style={{ width: '100%' }}
                      onClick={() => setOpenApprovalModal(true)}
                    />
                  </Row>
                )}
            </DisclaimerContainer>
            <PaymentReviewCard type="created" payment={selectedTransaction} />
          </Column>
        )}
      </ContentContainer>
      <Modal
        title={<Text variant="callout_semibold">Confirm Approval</Text>}
        open={openApprovalModal}
        onCancel={() => setOpenApprovalModal(false)}
        centered
        footer={
          <Row gap="xs" width="100%" justify="flex-end">
            <Button
              text="Cancel"
              variant="secondary"
              roundness="rounded"
              onClick={() => setOpenApprovalModal(false)}
            />
            <Button
              text="Approve"
              onClick={() => handleApprove()}
              roundness="rounded"
            />
          </Row>
        }
      >
        <Text
          variant="body_sm_regular"
          color={theme.textColor.layout.secondary.value}
          style={{ marginBottom: '46px' }}
        >
          You would like to approve the transaction?
        </Text>
      </Modal>
      <Modal
        title={<Text variant="callout_semibold">Deny transaction, why?</Text>}
        open={openDenyModal}
        onCancel={() => setOpenDenyModal(false)}
        centered
        footer={
          <Row gap="xs" width="100%" justify="flex-end">
            <Button
              text="Cancel"
              variant="secondary"
              roundness="rounded"
              onClick={() => setOpenDenyModal(false)}
            />

            <Button text="Reject" roundness="rounded" onClick={handleDeny} />
          </Row>
        }
      >
        <Column style={{ marginBlock: '32px' }}>
          <Input
            label=""
            placeholder="Description"
            value={denyReason}
            onChange={(e) => setDenyReason(e)}
          />
        </Column>
      </Modal>
      <ModalResult
        type={resultModalValues.type as 'SUCCESS' | 'FAIL'}
        isVisible={resultModalValues.isVisible}
        title={resultModalValues.title}
        subtitle={resultModalValues.subtitle}
        footer={resultModalValues.footer}
        closeOnBackgroundClick={false}
        onCancel={() =>
          setResultModalValues((p) => ({ ...p, isVisible: false }))
        }
      />
    </Container>
  );
}

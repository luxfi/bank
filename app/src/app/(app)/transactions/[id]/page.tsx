'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackButton } from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import { ConversionCard } from '@/components/ReviewCards/conversionCard';
import { PaymentReviewCard } from '@/components/ReviewCards/paymentCard';

import { UserRole } from '@/models/auth';
import { ITransactionDetails } from '@/models/payment';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { useTransactions } from '@/store/useTransactions';
import { Button, Column } from '@cdaxfx/ui';

export default function TransactionDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { onShowNotification } = useNotification();
  const { currentUser } = useAuth();

  const { errors, loading, getSelectedTransaction } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionDetails>({} as ITransactionDetails);

  const getTransactionDetails = async () => {
    await getSelectedTransaction(id as string).then((data) => {
      setSelectedTransaction(data);
    });
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  useEffect(() => {
    if (errors.getSelectedTransaction) {
      onShowNotification({
        type: 'ERROR',
        message: 'Error loading transaction details',
        description: errors.getSelectedTransaction,
      });
    }
  }, [errors.getSelectedTransaction, onShowNotification]);

  return (
    <Column width="100%">
      <BackButton>Transactions</BackButton>
      <Column width="100%" align="center">
        <Column width="640px" align="center">
          {loading.getSelectedTransaction && (
            <Column justify="center" height="50vh">
              <Loading />
            </Column>
          )}
          {!loading.getSelectedTransaction && (
            <>
              {selectedTransaction.type === 'payment' ? (
                <PaymentReviewCard
                  payment={selectedTransaction}
                  type="created"
                />
              ) : (
                <Column gap="lg" align="center">
                  <ConversionCard data={selectedTransaction} />
                  {currentUser?.role !== UserRole.ViewerUser && (
                    <Button
                      text="Make payment"
                      variant="secondary"
                      roundness="rounded"
                      onClick={() => router.push('/create-payment')}
                    />
                  )}
                </Column>
              )}
            </>
          )}
        </Column>
      </Column>
    </Column>
  );
}

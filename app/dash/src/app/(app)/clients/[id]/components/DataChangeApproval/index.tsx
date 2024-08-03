'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/Badge';
import Input from '@/components/Input';
import { LabelAndValue } from '@/components/LabelAndValue';
import ModalMessage from '@/components/ModalMessage';

import { UserRole } from '@/models/auth';

import { useMessages } from '@/context/Messages';

import { useAuth } from '@/store/useAuth';
import { useClients } from '@/store/useClient';
import { IGetApprovalMetadataResponse } from '@/store/useClient/types';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Row, Text, useTheme } from '@cdaxfx/ui';
import { Modal } from 'antd';

import { defaultTheme } from '@/styles/themes/default';

import { IDataChangeApprovalProps, formatApprovalData } from './types';

const DataChangeApproval: React.FC<IDataChangeApprovalProps> = ({
  session,
  clientId,
}) => {
  const { theme } = useTheme();

  const {
    getApprovalMetadata,
    approveMetadata,
    rejectMetadata,
    getClientsInfo,
    clientSelected,
    masterClientSelected,
  } = useClients();

  const { currentUser } = useAuth();

  const { onShowMessage } = useMessages();

  const [dataToApprove, setDataToApprove] =
    useState<IGetApprovalMetadataResponse>();

  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
  const [isConfirmApproveModalVisible, setIsConfirmApproveModalVisible] =
    useState(false);
  const [reason, setReason] = useState('');
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  const getApprovalData = useCallback(async () => {
    try {
      if (!clientId) return;

      const response = await getApprovalMetadata({
        uuid: clientId,
        session,
      });

      setDataToApprove(response || undefined);
    } catch (e) {
      console.error(e);
    }
  }, [clientId, getApprovalMetadata, session]);

  useEffect(() => {
    getApprovalData();
  }, [getApprovalData]);

  const handleShowReasonModal = useCallback(() => {
    setIsReasonModalVisible(true);
  }, []);

  const handleShowApproveModal = useCallback(() => {
    setIsConfirmApproveModalVisible(true);
  }, []);

  const handleReject = useCallback(async () => {
    try {
      if (!masterClientSelected?.uuid || !dataToApprove?.id) return;

      setIsRejectLoading(true);

      await rejectMetadata({
        clientId: masterClientSelected?.uuid,
        tempId: dataToApprove?.id,
        reason,
      });

      onShowMessage({
        status: 'fail',
        type: 'message',
        title: 'The data change rejected!',
        description: '',
        isVisible: true,
        onClose: () => {
          setDataToApprove(undefined);
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsRejectLoading(false);
      setIsReasonModalVisible(false);
    }
  }, [
    dataToApprove?.id,
    masterClientSelected?.uuid,
    onShowMessage,
    reason,
    rejectMetadata,
  ]);

  const handleApprove = useCallback(async () => {
    try {
      if (!masterClientSelected?.uuid || !dataToApprove?.id || !clientSelected)
        return;

      setIsApproveLoading(true);

      await approveMetadata({
        clientId: masterClientSelected?.uuid,
        tempId: dataToApprove?.id,
      });

      await getClientsInfo(clientSelected?.uuid);

      onShowMessage({
        status: 'success',
        type: 'message',
        title: 'Data change approved!',
        description: '',
        isVisible: true,
        onClose: () => {
          setDataToApprove(undefined);
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsApproveLoading(false);
    }
  }, [
    approveMetadata,
    clientSelected,
    dataToApprove?.id,
    getClientsInfo,
    masterClientSelected?.uuid,
    onShowMessage,
  ]);

  const formattedData = useMemo(
    () => (dataToApprove ? formatApprovalData(dataToApprove, session) : []),
    [dataToApprove, session]
  );

  return (
    <React.Fragment>
      {dataToApprove?.id && (
        <>
          <Card
            backgroundColor={theme.backgroundColor.layout['container-L1'].value}
            borderWidth="width-sm"
            borderColor={theme.borderColor.layout['border-subtle'].value}
            width="100%"
          >
            <Row width="100%" justify="space-between">
              <Text variant="body_md_bold">
                Request for data update approval.
              </Text>

              {currentUser?.role === UserRole.SuperAdmin ? (
                <Row gap="xxs">
                  <Button
                    text="Reject"
                    roundness="rounded"
                    size="small"
                    onClick={handleShowReasonModal}
                  />
                  <Button
                    text="Aprove"
                    roundness="rounded"
                    size="small"
                    onClick={handleShowApproveModal}
                  />
                </Row>
              ) : (
                <Badge
                  label="Waiting for Approval"
                  type="tag"
                  variant="warning"
                />
              )}
            </Row>

            {formattedData?.map((item, index) => (
              <div
                key={index}
                style={{
                  marginTop: index === 0 ? 8 : 0,
                  marginBottom: index !== formattedData?.length - 1 ? 8 : 0,
                }}
              >
                <LabelAndValue label={item.label} value={item.value} />
              </div>
            ))}
          </Card>

          <Modal
            open={isReasonModalVisible}
            centered
            onCancel={() => setIsReasonModalVisible(false)}
            footer={() => (
              <Row gap="xs" justify="flex-end" style={{ marginTop: 32 }}>
                <Button
                  text="Cancel"
                  variant="secondary"
                  roundness="rounded"
                  onClick={() => setIsReasonModalVisible(false)}
                />
                {isRejectLoading ? (
                  <LoadingOutlined
                    style={{
                      width: 96,
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: defaultTheme.colors.secondary,
                      fontSize: 16,
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  <Button
                    text="Reject"
                    roundness="rounded"
                    onClick={handleReject}
                  />
                )}
              </Row>
            )}
          >
            <Text variant="body_md_semibold">Reject data change, why?</Text>
            <Text
              variant="body_sm_regular"
              color={theme.textColor.layout.secondary.value}
              style={{ marginBottom: 16 }}
            >
              Describe the reason.
            </Text>

            <Input
              value={reason}
              placeholder="Description"
              autoFocus={true}
              onChange={setReason}
              label=""
            />
          </Modal>

          <ModalMessage
            isVisible={isConfirmApproveModalVisible}
            title="Confirm Approval"
            description="Would you like to approve the data change?"
            onConfirm={handleApprove}
            onCancel={() => setIsConfirmApproveModalVisible(false)}
            isLoading={isApproveLoading}
          />
        </>
      )}
    </React.Fragment>
  );
};

export default DataChangeApproval;

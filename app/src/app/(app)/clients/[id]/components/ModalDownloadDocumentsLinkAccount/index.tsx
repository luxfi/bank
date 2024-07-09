import { useState } from 'react';

import { useNotification } from '@/context/Notification';

import { useClients } from '@/store/useClient';
import { IDocument } from '@/store/useClient/types';
import { useDocuments } from '@/store/useDocuments';
import {
  Button,
  Column,
  Row,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import { Modal, Spin } from 'antd';

interface IProps {
  isVisible: boolean;
  onClose(): void;
}

export const ModalDownloadDocumentsLinkAccount = ({
  isVisible,
  onClose,
}: IProps) => {
  const { theme } = useTheme();

  const { clientSelected } = useClients();
  const { downloadClientDocument } = useDocuments();
  const { onShowNotification } = useNotification();

  const [loading, setLoading] = useState(false);

  const handleDownloadDoc = async (doc: IDocument) => {
    await downloadClientDocument(doc.uuid)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', doc.originalFilename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(() =>
        onShowNotification({
          type: 'ERROR',
          description: `Download error on document ${doc.originalFilename}`,
          message: 'Error',
        })
      );
  };

  const handleDownloadAllDocuments = async () => {
    if (!clientSelected?.documents || clientSelected?.documents?.length <= 0)
      return;

    setLoading(true);
    try {
      const promises = clientSelected?.documents?.map(
        (data) => data.document.uuid && handleDownloadDoc(data.document)
      );

      await Promise.all(promises);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={isVisible}
      footer={() => null}
      width={'516px'}
      closable={true}
      maskClosable={false}
      onCancel={() => onClose()}
    >
      <Column>
        <Text
          style={{ fontSize: 16, alignSelf: 'center', marginBottom: 24 }}
          variant="body_sm_bold"
        >
          Client Document
        </Text>

        {clientSelected?.documents?.length === 0 && (
          <Text
            color={theme.textColor.layout.secondary.value}
            style={{ fontSize: 14, alignSelf: 'center' }}
            variant="body_md_semibold"
          >{`There are no documents uploaded for the client.`}</Text>
        )}

        <Row style={{ gap: 16, flexWrap: 'wrap' }}>
          {clientSelected?.documents?.map((data) => (
            <Button
              disabled={loading}
              size="small"
              key={data.uuid}
              text={data.document?.originalFilename ?? 'document'}
              variant="secondary"
              roundness="rounded"
              rightIcon="cross-circle"
            />
          ))}
        </Row>

        {clientSelected?.documents?.length &&
          clientSelected?.documents?.length > 0 && (
            <Text
              color={theme.textColor.layout.secondary.value}
              style={{ fontSize: 14, marginTop: 16, alignSelf: 'center' }}
              variant="body_md_semibold"
            >{`${clientSelected?.documents?.length} Files`}</Text>
          )}

        {loading ? (
          <Spin size="large" style={{ alignSelf: 'center', marginTop: 32 }} />
        ) : (
          <Button
            disabled={clientSelected?.documents?.length === 0}
            style={{ alignSelf: 'flex-end', marginTop: 32 }}
            text="Download documents"
            roundness="rounded"
            onClick={() => handleDownloadAllDocuments()}
          />
        )}
      </Column>
    </Modal>
  );
};

'use client';

import { useMemo, useState } from 'react';

import { ModalUpload } from '@/components/ModalUpload';

import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import { useClients } from '@/store/useClient';
import { IDocument } from '@/store/useClient/types';
import { useDocuments } from '@/store/useDocuments';
import { EnumClientDocumentType } from '@/store/useDocuments/types';
import { Button, Column, Row, Text } from '@cdaxfx/ui';

import { ClientDocumentCard } from '../../../../../../components/ClientDocumentCard';
import { HeaderClientsDetails } from '../../components/Header';

interface IFileUpload {
  isVisible: boolean;
  title: string;
  type: EnumClientDocumentType;
}

export default function Documents() {
  const { onShowMessage } = useMessages();
  const { onShowNotification } = useNotification();
  const {
    uploadClientDocuments,
    linkDocumentToClient,
    deleteClientDocument,
    downloadClientDocument,
    loading,
  } = useDocuments();
  const { clientSelected, getClientsInfo } = useClients();

  const [fileSelectModal, setFileSelectModal] = useState<IFileUpload>({
    isVisible: false,
    title: 'Please upload your document here',
    type: EnumClientDocumentType.IdentityDocument,
  });

  const id = useMemo(() => clientSelected?.uuid ?? '', [clientSelected]);

  const linkFileToClient = async (docId: string) => {
    await linkDocumentToClient({
      clientId: id,
      documentUuid: docId,
      type: fileSelectModal.type,
    })
      .then(async () => {
        await getClientsInfo(id);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: err.message,
          description: 'Error associating document to client',
        });
      });
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    await uploadClientDocuments(formData)
      .then(async (res) => {
        await linkFileToClient(res.uuid);
        await getClientsInfo(id);
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: err.message,
          description: 'Error uploading document',
        });
      });
  };

  const handleDelete = async (docId: string, message: string) => {
    await deleteClientDocument({ clientId: id, documentUuid: docId })
      .then(async () => {
        await getClientsInfo(id);
        onShowMessage({
          type: 'message',
          title: 'The document has been deleted.',
          description: message,
          isVisible: true,
          status: 'success',
        });
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: err.message,
          description: 'Error deleting document',
        });
      });
  };

  const handleDownloadDoc = async (doc: IDocument) => {
    await downloadClientDocument(doc.uuid).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.originalFilename);
      document.body.appendChild(link);
      link.click();
    });
  };

  const loadingButtons = useMemo(() => {
    return (
      loading.deleteClientDocument ||
      loading.linkDocumentToClient ||
      loading.uploadClientDocuments ||
      loading.downloadClientDocument
    );
  }, [
    loading.deleteClientDocument,
    loading.linkDocumentToClient,
    loading.uploadClientDocuments,
    loading.downloadClientDocument,
  ]);

  return (
    <>
      <HeaderClientsDetails />

      <Column padding="sm" style={{ paddingTop: 40 }}>
        <Row align="center" justify="space-between" width="100%">
          <Text variant="headline_semibold" style={{ marginLeft: 16 }}>
            Number of Documents {clientSelected?.documents?.length}
          </Text>
        </Row>

        <ClientDocumentCard
          label="Identity document"
          type="required"
          loading={loadingButtons}
          document={
            clientSelected?.documents.find(
              (doc) => doc.type === EnumClientDocumentType.IdentityDocument
            )?.document || undefined
          }
          onUploadClick={() =>
            setFileSelectModal((p) => ({
              ...p,
              isVisible: true,
              title: 'Please upload your identity document here',
              type: EnumClientDocumentType.IdentityDocument,
            }))
          }
          onRemoveClick={(id: string) => {
            onShowMessage({
              isVisible: true,
              type: 'question',
              title: 'Are you sure you want to delete identity document?',
              textButtonConfirm: 'Delete',
              onConfirm: () => handleDelete(id, ''),
            });
          }}
          onDownloadClick={handleDownloadDoc}
        />

        <ClientDocumentCard
          label="Residential address"
          type="required"
          loading={loadingButtons}
          document={
            clientSelected?.documents.find(
              (doc) =>
                doc.type ===
                EnumClientDocumentType.ResidentialAddressVerification
            )?.document || undefined
          }
          onUploadClick={() =>
            setFileSelectModal((p) => ({
              ...p,
              isVisible: true,
              title: 'Please upload your residential address document here',
              type: EnumClientDocumentType.ResidentialAddressVerification,
            }))
          }
          onRemoveClick={(id: string) => {
            onShowMessage({
              isVisible: true,
              type: 'question',
              textButtonConfirm: 'Delete',
              title:
                'Are you sure you want to delete residential address document?',
              onConfirm: () => handleDelete(id, ''),
            });
          }}
          onDownloadClick={handleDownloadDoc}
        />

        <Row
          width="100%"
          align="center"
          justify="space-between"
          style={{ marginTop: 16 }}
        >
          <Text variant="headline_semibold" style={{ marginLeft: 16 }}>
            Add other documents
          </Text>
          <Row gap="sm">
            <Button
              variant="secondary"
              text="Add documents"
              leftIcon="plus-circle"
              roundness="rounded"
              onClick={() =>
                setFileSelectModal((p) => ({
                  ...p,
                  isVisible: true,
                  title: 'Please upload your document here',
                  type: EnumClientDocumentType.Other,
                }))
              }
            />
          </Row>
        </Row>
        {clientSelected?.documents
          ?.filter(
            (doc) =>
              doc.type !== EnumClientDocumentType.IdentityDocument &&
              doc.type !== EnumClientDocumentType.ResidentialAddressVerification
          )
          .map((item, index) => (
            <ClientDocumentCard
              key={index}
              document={item.document}
              type="optional"
              label={`Other document ${index + 1}`}
              loading={loadingButtons}
              onRemoveClick={(id: string) => {
                onShowMessage({
                  isVisible: true,
                  type: 'question',
                  textButtonConfirm: 'Delete',
                  title: 'Are you sure you want to delete this document?',
                  onConfirm: () => handleDelete(id, ''),
                });
              }}
              onUploadClick={() =>
                setFileSelectModal((p) => ({
                  ...p,
                  isVisible: true,
                  title: 'Please upload your document here',

                  type: EnumClientDocumentType.Other,
                }))
              }
              onDownloadClick={handleDownloadDoc}
            />
          ))}
      </Column>

      <ModalUpload
        isVisible={fileSelectModal.isVisible}
        onClose={() =>
          setFileSelectModal((pS) => ({ ...pS, isVisible: false }))
        }
        title={fileSelectModal.title}
        description="All files are encrypted, ensuring greater security in data transmission"
        onConfirm={(file) => {
          setFileSelectModal((pS) => ({ ...pS, isVisible: false }));
          handleUpload(file);
        }}
      />
    </>
  );
}

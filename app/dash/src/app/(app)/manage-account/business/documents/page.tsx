'use client';

import { useMemo, useState } from 'react';

import { ClientDocumentCard } from '@/components/ClientDocumentCard';
import { LabelAndValue } from '@/components/LabelAndValue';
import { ModalUpload } from '@/components/ModalUpload';

import { useMessages } from '@/context/Messages';
import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { IDocument } from '@/store/useClient/types';
import { useDocuments } from '@/store/useDocuments';
import { EnumClientDocumentType } from '@/store/useDocuments/types';
import { Column, Text, useTheme } from '@cdaxfx/ui';

import { HeaderDetails } from '../../components/Header';

interface IFileUpload {
  isVisible: boolean;
  title: string;
  type: EnumClientDocumentType;
}

export default function Documents() {
  const { theme } = useTheme();
  const { onShowMessage } = useMessages();
  const { currentClientInfo, getCurrentClientInfo } = useAuth();
  const { onShowNotification } = useNotification();

  const {
    uploadClientDocuments,
    linkDocumentToClient,
    deleteClientDocument,
    downloadClientDocument,
    loading,
  } = useDocuments();

  const [fileSelectModal, setFileSelectModal] = useState<IFileUpload>({
    isVisible: false,
    title: 'Please upload your document here',
    type: EnumClientDocumentType.IdentityDocument,
  });

  const documents = useMemo(() => {
    if (!currentClientInfo.client) return [];
    return currentClientInfo?.client?.documents;
  }, [currentClientInfo]);

  const linkFileToClient = async (docId: string) => {
    await linkDocumentToClient({
      clientId: currentClientInfo?.client?.uuid || '',
      documentUuid: docId,
      type: fileSelectModal.type,
    })
      .then(async () => {
        await getCurrentClientInfo();
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
        await getCurrentClientInfo();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: err.message,
          description: 'Error uploading document',
        });
      });
  };

  const handleDelete = async (docId: string) => {
    await deleteClientDocument({
      clientId: currentClientInfo?.client?.uuid || '',
      documentUuid: docId,
    })
      .then(async () => {
        await getCurrentClientInfo();
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
      <HeaderDetails />

      <Column padding="sm" style={{ width: '100%' }}>
        <Column
          padding="sm"
          gap="sm"
          style={{
            borderRadius: 8,
            backgroundColor: theme.backgroundColor.layout['container-L2'].value,
            width: '100%',
            marginTop: 24,
          }}
        >
          <LabelAndValue label="Identity document" value="" />
          <LabelAndValue label="Residential address" value="" />
        </Column>
      </Column>

      <Column padding="sm" style={{ paddingTop: 40 }}>
        <Text variant="headline_semibold">Submit Documents</Text>
        <ClientDocumentCard
          label="Identity document"
          type="required"
          loading={loadingButtons}
          document={
            documents.find(
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
              onConfirm: () => handleDelete(id),
            });
          }}
          onDownloadClick={handleDownloadDoc}
        />

        <ClientDocumentCard
          label="Residential address"
          type="required"
          loading={loadingButtons}
          document={
            documents.find(
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
              onConfirm: () => handleDelete(id),
            });
          }}
          onDownloadClick={handleDownloadDoc}
        />
      </Column>

      <ModalUpload
        isVisible={fileSelectModal.isVisible}
        onClose={() =>
          setFileSelectModal((pS) => ({ ...pS, isVisible: false }))
        }
        title="Please upload identity document your files here"
        description="All files are encrypted, ensuring greater security in data transmission"
        onConfirm={(file) => {
          setFileSelectModal((pS) => ({ ...pS, isVisible: false }));
          handleUpload(file);
        }}
      />
    </>
  );
}

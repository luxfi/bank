'use client';

import { useCallback, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal as ModalAntd } from 'antd';
import { useFormik } from 'formik';

import { updateUserMetadata } from '@/api/user';

import { defaultTheme } from '@/styles/themes/default';

import { ContentModal, ContentButton } from './Style';

interface IDataForm {
  identificationNumber: string;
  identificationType: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export default function ModalIdentification({
  openModal,
  onCloseModal,
}: IModalProps) {
  const { onShowNotification } = useNotification();
  const { currentUser, setUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (data: IDataForm) => {
    setLoading(true);

    await updateUserMetadata({
      ...currentUser!.currentClient.account!.individualMetadata,
      identificationNumber: data.identificationNumber,
      identificationType: data.identificationType,
    })
      .then((user) => {
        onShowNotification({
          type: 'SUCCESS',
          message: 'Success',
          description: 'User updated successfully',
        });

        if (user) {
          setUser(user);
        }

        setLoading(false);
        onCloseModal();
      })
      .catch((err) => {
        onShowNotification({
          type: 'ERROR',
          message: 'Error',
          description: err.message,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const formik = useFormik<IDataForm>({
    initialValues: {
      identificationNumber:
        currentUser?.currentClient?.account?.individualMetadata
          ?.identificationNumber ?? '',
      identificationType:
        currentUser?.currentClient?.account?.individualMetadata
          ?.identificationType ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Identification"
      onCancel={onCloseModal}
      footer={null}
      open={openModal}
    >
      <ContentModal>
        <Input
          value={formik.values.identificationNumber}
          onChange={formik.handleChange('identificationNumber')}
          label="Identification Number:"
        />
        <Input
          value={formik.values.identificationType}
          onChange={formik.handleChange('identificationType')}
          label="Identification Type:"
        />

        <ContentButton>
          {loading ? (
            <LoadingOutlined
              style={{
                color: defaultTheme.colors.secondary,
                fontSize: 40,
                fontWeight: 600,
                paddingInline: 20,
              }}
            />
          ) : (
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              color={defaultTheme.colors.secondary}
              style={{ width: 160 }}
            >
              Save
            </Button>
          )}
        </ContentButton>
      </ContentModal>
    </ModalAntd>
  );
}

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
  publicPosition: string;
  highProfilePosition: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export default function ModalOther({ openModal, onCloseModal }: IModalProps) {
  const { onShowNotification } = useNotification();
  const { currentUser, setUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (data: IDataForm) => {
    setLoading(true);

    await updateUserMetadata({
      ...currentUser!.currentClient.account!.individualMetadata,
      publicPosition: data.publicPosition,
      highProfilePosition: data.highProfilePosition,
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
      publicPosition:
        currentUser?.currentClient?.account?.individualMetadata
          ?.publicPosition ?? '',
      highProfilePosition:
        currentUser?.currentClient?.account?.individualMetadata
          ?.highProfilePosition ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Other"
      onCancel={onCloseModal}
      footer={null}
      open={openModal}
    >
      <ContentModal>
        <Input
          value={formik.values.publicPosition}
          onChange={formik.handleChange('publicPosition')}
          label="Public Position Held:"
        />
        <Input
          value={formik.values.highProfilePosition}
          onChange={formik.handleChange('highProfilePosition')}
          label="High Profile Position Held:"
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

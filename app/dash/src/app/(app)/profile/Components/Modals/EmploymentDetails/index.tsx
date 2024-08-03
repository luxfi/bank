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
  occupation: string;
  employerName: string;
  address1: string;
  address2: string;
  address3: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export default function ModalEmploymentDetails({
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

      occupation: data.occupation,
      employerName: data.employerName,
      employerAddress1: data.address1,
      employerAddress2: data.address2,
      employerAddress3: data.address3,
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
      occupation:
        currentUser?.currentClient?.account?.individualMetadata?.occupation ??
        '',
      employerName:
        currentUser?.currentClient?.account?.individualMetadata?.employerName ??
        '',
      address1:
        currentUser?.currentClient?.account?.individualMetadata?.employerName ??
        '',
      address2:
        currentUser?.currentClient?.account?.individualMetadata
          ?.employerAddress2 ?? '',
      address3:
        currentUser?.currentClient?.account?.individualMetadata
          ?.employerAddress3 ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Employment Details"
      onCancel={onCloseModal}
      footer={null}
      centered
      open={openModal}
    >
      <ContentModal>
        <Input
          value={formik.values.occupation}
          onChange={formik.handleChange('occupation')}
          label="Occupation:"
        />
        <Input
          value={formik.values.employerName}
          onChange={formik.handleChange('employerName')}
          label="Employer Name:"
        />
        <Input
          value={formik.values.address1}
          onChange={formik.handleChange('address1')}
          label="Employer Address 1:"
        />
        <Input
          value={formik.values.address2}
          onChange={formik.handleChange('address2')}
          label="Employer Address 2:"
        />
        <Input
          value={formik.values.address3}
          onChange={formik.handleChange('address3')}
          label="Employer Address 2:"
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

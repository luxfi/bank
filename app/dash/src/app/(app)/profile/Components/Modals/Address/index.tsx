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
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  stateCountry: string;
  country: string;
  previousAddressLine1: string;
  previousAddressLine2: string;
  previousCity: string;
  previousPostCode: string;
  previousState: string;
  previousCountry: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

export default function ModalAddress({ openModal, onCloseModal }: IModalProps) {
  const { onShowNotification } = useNotification();
  const { currentUser, setUser } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (data: IDataForm) => {
    setLoading(true);

    await updateUserMetadata({
      ...currentUser!.currentClient?.account!.individualMetadata,

      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      postcode: data.postCode,
      state: data.stateCountry,
      country: data.country,
      previousAddressLine1: data.previousAddressLine1,
      previousAddressLine2: data.previousAddressLine2,
      previousCity: data.previousCity,
      previousPostcode: data.previousPostCode,
      previousCountry: data.previousCountry,
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
      addressLine1:
        currentUser?.currentClient?.account?.individualMetadata?.addressLine1 ??
        '',
      addressLine2:
        currentUser?.currentClient?.account?.individualMetadata?.addressLine2 ??
        '',
      city: currentUser?.currentClient?.account?.individualMetadata?.city ?? '',
      postCode:
        currentUser?.currentClient?.account?.individualMetadata?.postcode ?? '',
      stateCountry:
        currentUser?.currentClient?.account?.individualMetadata?.state ?? '',
      country:
        currentUser?.currentClient?.account?.individualMetadata?.country ?? '',
      previousAddressLine1:
        currentUser?.currentClient?.account?.individualMetadata
          ?.previousAddressLine1 ?? '',
      previousAddressLine2:
        currentUser?.currentClient?.account?.individualMetadata
          ?.previousAddressLine2 ?? '',
      previousCity:
        currentUser?.currentClient?.account?.individualMetadata?.previousCity ??
        '',
      previousPostCode:
        currentUser?.currentClient?.account?.individualMetadata
          ?.previousPostcode ?? '',
      previousState:
        currentUser?.currentClient?.account?.individualMetadata
          ?.previousPostcode ?? '',
      previousCountry:
        currentUser?.currentClient?.account?.individualMetadata
          ?.previousCountry ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Address"
      onCancel={onCloseModal}
      footer={null}
      width={900}
      open={openModal}
    >
      <ContentModal>
        <Input
          value={formik.values.addressLine1}
          onChange={formik.handleChange('addressLine1')}
          label="Address Line 1:"
        />
        <Input
          value={formik.values.addressLine2}
          onChange={formik.handleChange('addressLine2')}
          label="Address Line 2:"
        />
        <Input
          value={formik.values.city}
          onChange={formik.handleChange('DOB')}
          label="City:"
        />
        <Input
          value={formik.values.postCode}
          onChange={formik.handleChange('postCode')}
          label="Zip Code / Post Code:"
        />
        <Input
          value={formik.values.stateCountry}
          onChange={formik.handleChange('stateCountry')}
          label="State / Country:"
        />
        <Input
          value={formik.values.country}
          onChange={formik.handleChange('country')}
          label="Country:"
        />
        <Input
          value={formik.values.previousAddressLine1}
          onChange={formik.handleChange('previousAddressLine1')}
          label="Previous Address Line 1:"
        />
        <Input
          value={formik.values.previousAddressLine2}
          onChange={formik.handleChange('previousAddressLine2')}
          label="Previous Address Line 2:"
        />
        <Input
          value={formik.values.previousCity}
          onChange={formik.handleChange('previousCity')}
          label="Previous City:"
        />
        <Input
          value={formik.values.previousPostCode}
          onChange={formik.handleChange('previousPostCode')}
          label="Previos Post Code:"
        />
        <Input
          value={formik.values.previousState}
          onChange={formik.handleChange('previousState')}
          label="Previous State Country:"
        />
        <Input
          value={formik.values.previousCountry}
          onChange={formik.handleChange('previousCountry')}
          label="Previous Country:"
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

'use client';

import { useCallback, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import SelectDate from '@/components/SelectDate';

import { useNotification } from '@/context/Notification';

import { useAuth } from '@/store/useAuth';
import { LoadingOutlined } from '@ant-design/icons';
import { Modal as ModalAntd } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useFormik } from 'formik';

import { updateUserMetadata } from '@/api/user';

import { defaultTheme } from '@/styles/themes/default';

import { ContentButton, ContentModal } from './Style';

interface IDataForm {
  title: string;
  fullName: string;
  formerNames: string;
  DOB: string;
  placeOfBirth: string;
  telNo: string;
  nationality: string;
  gender: string;
}

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
}

const titleOptions: DefaultOptionType[] = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Miss', value: 'Miss' },
  { label: 'Ms.', value: 'Ms.' },
];

const genderOption: DefaultOptionType[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function ModalPersonalDetails({
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

      title: data.title,
      firstname: data.fullName.split(' ')?.[0],
      lastname: data.fullName.split(' ')?.[1] ?? '',
      formerName: data.formerNames,
      dateOfBirth: data.DOB as any,
      placeOfBirth: data.placeOfBirth,
      country: data.nationality,
      gender: data.gender,
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
        setLoading(false);
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
      title:
        currentUser?.currentClient?.account?.individualMetadata?.title ?? '',
      fullName:
        `${currentUser?.currentClient?.account?.individualMetadata?.firstname} ${currentUser?.currentClient?.account?.individualMetadata?.lastname}` ??
        '',
      DOB:
        currentUser?.currentClient?.account?.individualMetadata?.dateOfBirth?.toString() ??
        '',
      formerNames:
        currentUser?.currentClient?.account?.individualMetadata?.formerName ??
        '',
      gender:
        currentUser?.currentClient?.account?.individualMetadata?.gender ?? '',
      nationality:
        currentUser?.currentClient?.account?.individualMetadata?.country ?? '',
      placeOfBirth:
        currentUser?.currentClient?.account?.individualMetadata?.placeOfBirth ??
        '',
      telNo: currentUser?.contact?.mobileNumber ?? '',
    },
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <ModalAntd
      title="Personal Details"
      onCancel={onCloseModal}
      footer={null}
      open={openModal}
    >
      <ContentModal>
        <Select
          options={titleOptions}
          value={formik.values.title}
          onChange={formik.handleChange('title')}
          label="Title:"
        />
        <Input
          value={formik.values.fullName}
          onChange={formik.handleChange('fullName')}
          label="Full Name:"
        />
        <SelectDate
          value={formik.values.DOB}
          onChange={formik.handleChange('DOB')}
          label="DOB:"
        />
        <Input
          value={formik.values.placeOfBirth}
          onChange={formik.handleChange('placeOfBirth')}
          label="Place of Birth:"
        />
        <Input
          label="Phone Number"
          onChange={(v) => formik.setFieldValue('telNo', v)}
          value={formik.values.telNo}
          variant="phoneNumber"
        />

        <Input
          value={formik.values.nationality}
          onChange={formik.handleChange('nationality')}
          label="Nationality:"
        />
        <Select
          options={genderOption}
          value={formik.values.gender}
          onChange={formik.handleChange('gender')}
          label="Gender:"
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

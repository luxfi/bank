'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';

import { ICurrentUser } from '@/models/auth';

import { Modal as ModalAntd } from 'antd';
import { FormikConfig, useFormik } from 'formik';

import { defaultTheme } from '@/styles/themes/default';

import { updateUserSchema } from '../../models/update-user-schema';
import { ContentButton, ContentModal } from './Style';

interface IModalProps {
  openModal: boolean;
  onCloseModal: () => void;
  data: ICurrentUser;
  onSubmit: FormikConfig<ICurrentUser>['onSubmit'];
}

export default function Modal({
  openModal,
  onCloseModal,
  data,
  onSubmit,
}: IModalProps) {
  const formik = useFormik<ICurrentUser>({
    initialValues: data,
    validationSchema: updateUserSchema,
    onSubmit: onSubmit,
  });

  return (
    <ModalAntd
      title="Edit profile"
      onCancel={onCloseModal}
      footer={null}
      centered
      open={openModal}
    >
      <ContentModal>
        <Input
          value={data?.firstname}
          onChange={formik.handleChange('firstname')}
          label="First name:"
          error={formik.errors.firstname}
        />
        <Input
          value={data?.lastname}
          onChange={formik.handleChange('lastname')}
          label="Last name:"
          error={formik.errors.lastname}
        />
        <Input
          value={data?.username}
          onChange={formik.handleChange('username')}
          label="Email:"
          error={formik.errors.username}
        />
        <ContentButton>
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
        </ContentButton>
      </ContentModal>
    </ModalAntd>
  );
}

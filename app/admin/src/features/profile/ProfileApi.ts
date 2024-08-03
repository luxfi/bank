import * as ApiHelpers from '../../utils/api-helpers';
import { AdminClientDto } from '../admin-clients/model/adminClientSchema';
import { UserRole } from '../auth/user-role.enum';
import { ResetPasswordData } from './ProfileSlice';

export const resetPassword = async (data: ResetPasswordData): Promise<boolean> => {
  const res = await ApiHelpers.fetch('/api/v1/users/current/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

    const { statusCode, message } = await res.json();

    if (statusCode === 200) {
      return true;
    }

    if (message) {
      throw new Error(message);
    }
    throw new Error("Reset password failed.");
}

export const getProfile = async (uuid: string): Promise<boolean> => {
  const res = await ApiHelpers.fetch(`/api/v1/users/${uuid}`, {
    method: 'GET',
  });
  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
  }

  throw new Error("Profile couldn't be fetched.");
}

export const updateUser = async (
  uuid: string,
  data: AdminClientDto
) => {
  const res = await ApiHelpers.fetch(`/api/v1/users/${uuid}`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.client) {
      return response?.data?.client;
    }
  }

  throw new Error("Updating failed.");
};

export const updateMetadata = async (uuid: string, data: any) => {
  //FIXME: Use less hacky way to fix the DOB issues
  data.afterRegistration = true;
  const dataToSend = JSON.parse(JSON.stringify(data));
  if (dataToSend.individualMetadata?.dateOfBirth) {
    dataToSend.individualMetadata.dateOfBirth = dataToSend.individualMetadata.dateOfBirth.split("T")[0];
  }
  const res = await ApiHelpers.fetch(`/api/v1/users/current/metadata`, {
    method: "POST",
    body: JSON.stringify(dataToSend),
  });

  if (res.ok) {
    const response = await res.json();
    if (response?.data?.user) {
      return response?.data?.user;
    }
    return response;
  }
  const response = await res.json();
  throw response;
};

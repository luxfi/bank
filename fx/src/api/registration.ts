import { EnumEntityType } from '@/models/entityType';

import { IRequestRegistrationForm } from '@/app/(auth)/registration/page';

import { dataFetch } from './fetchers';
import { REGISTRATION } from './paths';

interface IResponse {
  statusCode: number;
  message?: string;
}

export async function submitInvitation(data: any): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: REGISTRATION.SUBMIT_USER_INVITATION,
      method: 'POST',
      bodyParams: {
        ...data,
      },
    });

    const { statusCode, message } = response;

    if ([200, 201].includes(statusCode)) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Invite the User');
  } catch (error) {
    throw new Error('Unable to Invite the User');
  }
}

interface IInvitaionData extends IResponse {
  data: any & { entityType: EnumEntityType };
}
export async function getInvitationData(uuid: string): Promise<IInvitaionData> {
  try {
    const response = await dataFetch({
      endpoint: REGISTRATION.GET(uuid),
      method: 'GET',
    });

    const { statusCode, data, message } = response;

    if (data) {
      return {
        statusCode,
        data: data,
        message,
      };
    }
    throw new Error(message ?? 'Unable to get invitation data');
  } catch (error) {
    throw new Error('Unable to get invitation data');
  }
}

export async function emailExists(email: string): Promise<boolean> {
  const encodedEmail = encodeURIComponent(email);
  try {
    const response = await dataFetch({
      endpoint: REGISTRATION.EMAIL_EXISTS(encodedEmail),
      method: 'GET',
    });

    const { data } = response;

    if (data) {
      return data.exists;
    }

    return false;
  } catch (error) {
    throw new Error('Unable to check if email already exists');
  }
}

export async function sendRegistrationRequest(
  data: IRequestRegistrationForm
): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: REGISTRATION.REQUEST_REGISTRATION,
      method: 'POST',
      bodyParams: {
        ...data,
      },
    });

    const { statusCode, message } = response;

    if ([200, 201].includes(statusCode)) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to send request');
  } catch (error) {
    throw new Error('Unable to send request');
  }
}

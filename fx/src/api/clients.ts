import {
  IBankMetadata,
  IBrokers,
  IClientBusiness,
  IClientContact,
  IClientDirectors,
  IClientUser,
  IClients,
  IDtoClientsPost,
  IIndividualMetadata,
  INewClient,
  IRiskAssessment,
  IShareholder,
  ISubAccount,
} from '@/models/clients';

import { dataFetch } from './fetchers';
import { CLIENTS } from './paths';

export async function newClient(dto: INewClient) {
  const endpoint = CLIENTS.NEW_CLIENT;

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...dto,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join('\n') : message ?? '');
}

interface IClientsDTO {
  page: number;
  limit: number;
}

interface IClientsResponse {
  data: {
    clients: Array<IClients>;
    count: number;
  };
  statusCode: number;
}

export async function getClients(dto: IClientsDTO): Promise<IClientsResponse> {
  try {
    const response = await dataFetch({
      endpoint: CLIENTS.GET,
      method: 'GET',
      urlParams: {
        ...dto,
      },
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: {
          clients: data?.clients || [],
          count: data?.count || 0,
        },
        statusCode: statusCode,
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function deleteClient(uuid: string): Promise<IClientsResponse> {
  try {
    const endpoint = CLIENTS.DELETE(uuid);

    const response = await dataFetch({
      endpoint: endpoint,
      method: 'DELETE',
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: {
          clients: data?.clients || [],
          count: data?.count || 0,
        },
        statusCode: statusCode,
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

interface IClientDTO {
  id: string;
  isCalledServer: boolean;
  clientId: string;
}

export async function getClient(dto: IClientDTO) {
  try {
    const endpoint = `${CLIENTS.GET}/${dto.id}`;

    const response = await dataFetch<{ client: IClients }>({
      endpoint: endpoint,
      urlParams: {
        client: dto.clientId,
      },
      method: 'GET',
      isCalledServer: dto.isCalledServer,
      cache: 'no-cache',
    });

    const { data, statusCode, message } = response;

    if (statusCode === 200) {
      return data;
    }

    throw new Error(message ?? '');
  } catch (error) {
    return null;
  }
}

export async function getSubAccount() {
  try {
    const endpoint = `${CLIENTS.SUB_ACCOUNT}`;

    const response = await dataFetch<{ client: ISubAccount }>({
      endpoint: endpoint,
      method: 'GET',
      isCalledServer: true,
      cache: 'no-cache',
    });

    const { data, statusCode, message } = response;

    if (statusCode === 200) {
      return data;
    }

    throw new Error(message ?? '');
  } catch (error) {
    return null;
  }
}

export async function updateDetailsOfRegistrar(
  dto: IDtoClientsPost,
  uuid: string
) {
  const endpoint = CLIENTS.POST(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...dto,
    },
  });

  const { data, statusCode, message } = response;

  if (statusCode === 200) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : 'Error');
}

export async function updatePersonalDetails(
  dto: { clientId: string; individualMetadata: IIndividualMetadata },
  uuid: string
) {
  const endpoint = CLIENTS.PERSONAL_DETAILS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      individualMetadata: dto.individualMetadata,
    },
  });

  const { data, statusCode, message } = response;

  if (statusCode === 200) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : 'Error');
}

export async function updateEmploymentDetailsIndividual(
  dto: { clientId: string; individualMetadata: IIndividualMetadata },
  uuid: string
) {
  const endpoint = CLIENTS.EMPLOYMENT_DETAILS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      individualMetadata: dto.individualMetadata,
    },
  });

  const { data, statusCode, message } = response;

  if (statusCode === 200) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : 'Error');
}

interface IDtoResetPassword {
  newPassword: string;
  confirmPassword: string;
}

export async function resetPassword(dto: IDtoResetPassword, uuid: string) {
  const endpoint = CLIENTS.RESET_PASSWORD(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...dto,
    },
  });

  const { statusCode, message } = response;

  if ([200, 201].includes(statusCode)) {
    return;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : '');
}

interface IDtoLinkUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  country: string;
  account_uuid: string;
  linked_user_uuid: string;
}

export async function linkUser(dto: IDtoLinkUser) {
  const endpoint = CLIENTS.LINK_USER;

  const response = await dataFetch<{ user: IClientContact }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...dto,
    },
  });

  const { statusCode, message } = response;

  if ([200, 201].includes(statusCode)) {
    return response.data?.user;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : '');
}

export async function linkUserDelete(uuid: string) {
  const endpoint = CLIENTS.LINK_USER_DELETE(uuid);

  const response = await dataFetch<{ user: IClientUser }>({
    endpoint: endpoint,
    method: 'DELETE',
  });

  const { statusCode, message, data } = response;

  if (statusCode === 200 && data) {
    return response.data?.user;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateCompanyDetails(
  dto: { clientId: string; businessMetadata: IClientBusiness },
  userID: string
) {
  const endpoint = CLIENTS.COMPANY_DETAILS(userID);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    bodyParams: {
      clientId: dto.clientId,
      businessMetadata: {
        ...dto.businessMetadata,
      },
    },
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateAddressBusiness(
  dto: { clientId: string; businessMetadata: IClientBusiness },
  userID: string
) {
  const endpoint = CLIENTS.ADDRESS(userID);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    bodyParams: {
      clientId: dto.clientId,
      businessMetadata: {
        ...dto.businessMetadata,
      },
    },
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateAddressIndividual(
  dto: { clientId: string; individualMetadata: IIndividualMetadata },
  userID: string
) {
  const endpoint = CLIENTS.ADDRESS(userID);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    bodyParams: {
      clientId: dto.clientId,
      individualMetadata: dto.individualMetadata,
    },
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

interface IDocumentDTO {
  file: File;
}

export async function updateDocuments(dto: IDocumentDTO) {
  const endpoint = CLIENTS.DOCUMENTS();

  const formData = new FormData();
  formData.append('file', dto.file);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    bodyParams: formData,
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function deleteDirectors(
  dto: { directors: Array<IClientDirectors>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.DIRECTORS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      directors: dto.directors,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function deleteShareholders(
  dto: { shareholder: Array<IShareholder>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.DIRECTORS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      shareholders: dto.shareholder,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function deleteBrokers(
  dto: { brokers: Array<IBrokers>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.BROKERS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      brokers: dto.brokers,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateDirectors(
  dto: { directors: Array<IClientDirectors>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.DIRECTORS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      directors: dto.directors,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateShareholder(
  dto: { shareholder: Array<IShareholder>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.DIRECTORS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      shareholders: dto.shareholder,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateBrokers(
  dto: { brokers: Array<IBrokers>; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.DIRECTORS(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      brokers: dto.brokers,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

interface IExpectedActivityDTO {
  clientId: string;
  businessMetadata: IClientBusiness;
  expectedValueOfTurnover: string;
  expectedVolumeOfTransactions: string;
}

export async function updateExpectedActivity(
  dto: IExpectedActivityDTO,
  uuid: string
) {
  const endpoint = CLIENTS.EXPECTED_ACTIVITY(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...dto,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateBankAccountDetails(
  dto: { bankMetadata: IBankMetadata; clientId: string },
  uuid: string
) {
  const endpoint = CLIENTS.BANK_ACCOUNT(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: dto.clientId,
      bankMetadata: dto.bankMetadata,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateRiskAssessment(dto: IRiskAssessment, uuid: string) {
  const endpoint = CLIENTS.RISK_ASSESSMENT(uuid);

  const response = await dataFetch<{ client: IClients }>({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      riskAssessment: dto,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

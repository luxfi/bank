import { IPaginationResponse } from '@/models/pagination';

import { dataFetch } from '@/api/fetchers';

import {
  IClientInfoResponse,
  IDeleteShareholderPayload,
  IGetClientsResponse,
  IGetRiskAssessmentsResponse,
  ILinkUserPayload,
  IPayloadApproveMetadata,
  IPayloadBankMetadata,
  IPayloadBrokers,
  IPayloadBusinessMetadata,
  IPayloadChangePassword,
  IPayloadDirectors,
  IPayloadGetApprovalMetadata,
  IPayloadGetClients,
  IPayloadIndividualMetadata,
  IPayloadLinkAccountCurrencyCloud,
  IPayloadLinkAccountIFX,
  IPayloadRejectMetadata,
  IPayloadRiskAssessment,
  IPayloadSendWelcomeEmail,
  IPostShareholder,
  IResponseSubAccount,
  IRiskAssessment,
  IUpdateDetailOfRegistrarPayload,
  IUpdateLinkedUserPayload,
  IUserClientResponse,
  IUsersClientsPayload,
  PATHS,
} from './types';

export async function getClientsAPI(
  payload: IPayloadGetClients
): Promise<IGetClientsResponse> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET,
      method: 'GET',
      urlParams: {
        ...payload,
      },
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: data?.clients ?? [],
        count: data?.count ?? 0,
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function getClientsByIdAPI(clientId: string): Promise<any> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET_BY_ID(clientId),
      method: 'GET',
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: data?.clients ?? [],
        count: data?.count ?? 0,
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function getRiskAssessmentsAPI(
  payload: IPayloadGetClients
): Promise<IGetRiskAssessmentsResponse> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET_RISK_ASSESSMENTS,
      method: 'GET',
      urlParams: {
        ...payload,
      },
    });

    const { statusCode, data, pagination, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: data ?? [],
        pagination: pagination ?? ({} as IPaginationResponse),
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function updateDetailsOfRegistrarAPI(
  payload: IUpdateDetailOfRegistrarPayload
): Promise<void> {
  const { uuid, ...body } = payload;

  const endpoint = PATHS.POST(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { data, statusCode, message } = response;

  if (statusCode === 200) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : 'Error');
}

export async function getClientInfoAPI(
  clientId: string
): Promise<IClientInfoResponse> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET_INFO(clientId),
      method: 'GET',
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return data;
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function archiveClientAPI(
  clientId: string
): Promise<IGetClientsResponse> {
  try {
    const endpoint = PATHS.ARCHIVE(clientId);

    const response = await dataFetch({
      endpoint: endpoint,
      method: 'DELETE',
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return {
        data: data?.clients ?? [],
        count: data?.count ?? 0,
      };
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function getUsersClientsAPI(
  payload: IUsersClientsPayload
): Promise<IUserClientResponse> {
  try {
    const { clientUuid, ...params } = payload;
    const response = await dataFetch<IUserClientResponse>({
      endpoint: PATHS.GET_USERS_CLIENTS(clientUuid),
      method: 'GET',
      urlParams: {
        ...params,
      },
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return data;
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function submitRiskAssessmentAPI(
  payload: IPayloadRiskAssessment
): Promise<IRiskAssessment> {
  try {
    const { clientUuid, ...params } = payload;

    const response = await dataFetch({
      endpoint: PATHS.POST_RISK_ASSESSMENT(clientUuid),
      method: 'POST',
      bodyParams: {
        ...params,
      },
    });

    const { statusCode, data, message } = response;

    if (statusCode === 200 && data) {
      return data;
    }

    throw new Error(message ?? '');
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function removeLinkedUserAPI(
  userId: string,
  clientId: string
): Promise<void> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.REMOVE_LINKED_USER(userId, clientId),
      method: 'DELETE',
    });
    const { statusCode, message } = response;

    if (statusCode !== 200) {
      throw new Error(message);
    }
  } catch (error) {
    throw new Error((error as any)?.message ?? '');
  }
}

export async function postLinkedUserAPI(payload: ILinkUserPayload) {
  const endpoint = PATHS.POST_LINKED_USER;

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...payload,
    },
  });

  const { statusCode, message } = response;

  if ([200, 201].includes(statusCode)) {
    return response.data?.user;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : '');
}
export async function updateLinkedUserAPI(payload: IUpdateLinkedUserPayload) {
  const endpoint = PATHS.UPDATE_LINKED_USER(payload.uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      ...payload,
    },
  });

  const { statusCode, message } = response;

  if ([200, 201].includes(statusCode)) {
    return response.data?.user;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : '');
}

export async function postBankAccountDetailsAPI(payload: IPayloadBankMetadata) {
  const { masterClientId, clientUuid, bankMetadata } = payload;

  const endpoint = PATHS.POST_BANK_ACCOUNT(masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: clientUuid,
      bankMetadata: bankMetadata,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function postIndividualMetadataAPI(
  payload: IPayloadIndividualMetadata
) {
  const { masterClientId, clientUuid, individualMetadata } = payload;

  const endpoint = PATHS.POST_INDIVIDUAL_METADATA(masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: clientUuid,
      individualMetadata: individualMetadata,
    },
  });

  const { data, statusCode, message } = response;

  if (statusCode === 200) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : 'Error');
}

export async function postBusinessMetadataAPI(
  payload: IPayloadBusinessMetadata
) {
  const { masterClientId, clientUuid, businessMetadata } = payload;

  const endpoint = PATHS.POST_BUSINESS_METADATA(masterClientId);

  const response = await dataFetch({
    method: 'POST',
    endpoint: endpoint,
    bodyParams: {
      clientId: clientUuid,
      businessMetadata: {
        ...businessMetadata,
      },
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function postDirectorsAPI(payload: IPayloadDirectors) {
  const endpoint = PATHS.POST_INDIVIDUAL_METADATA(payload.masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: payload.clientUuid,
      directors: payload.directors,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function postBrokersAPI(payload: IPayloadBrokers) {
  const endpoint = PATHS.POST_INDIVIDUAL_METADATA(payload.masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: payload.clientUuid,
      brokers: payload.brokers,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function postShareholder(
  payload: IPostShareholder
): Promise<void> {
  const { masterClientId, clientId, shareholders } = payload;

  const endpoint = PATHS.POST_SHAREHOLDER(masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: clientId,
      partial: true,
      shareholders,
    },
  });

  const { statusCode, message } = response;

  if (statusCode !== 200) {
    throw new Error(message);
  }
}

export async function deleteShareholder(
  payload: IDeleteShareholderPayload
): Promise<void> {
  const { masterClientId, clientId, shareholders } = payload;

  const endpoint = PATHS.POST_SHAREHOLDER(masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: clientId,
      partial: true,
      shareholders,
    },
  });

  const { statusCode, message } = response;

  if (statusCode !== 200) {
    throw new Error(message);
  }
}

export async function getSubAccountAPI() {
  try {
    const endpoint = `${PATHS.GET_SUB_ACCOUNT}`;

    const response = await dataFetch<{
      subaccounts: Array<IResponseSubAccount>;
    }>({
      endpoint: endpoint,
      method: 'GET',
      isCalledServer: true,
      cache: 'no-cache',
    });

    const { data, statusCode, message } = response;

    if (statusCode === 200) {
      return data?.subaccounts ?? [];
    }

    throw new Error(message ?? '');
  } catch (error) {
    return [];
  }
}

export async function postLinkAccountCurrencyCloudAPI(
  payload: IPayloadLinkAccountCurrencyCloud
) {
  const endpoint = PATHS.POST_LINK_ACCOUNT_CURRENCY_CLOUD(
    payload.masterClientId
  );

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: payload.clientId,
      contactId: payload.contactId,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function postLinkAccountIfxAPI(payload: IPayloadLinkAccountIFX) {
  const endpoint = PATHS.POST_LINK_ACCOUNT_IFX(payload.masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: payload.clientId,
      credentials: {
        clientId: payload.credentials.clientId,
        clientSecret: payload.credentials.clientSecret,
        username: payload.credentials.username,
        password: payload.credentials.password,
      },
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function changePassword(payload: IPayloadChangePassword) {
  const { uuid, ...params } = payload;

  const endpoint = PATHS.CHANGE_PASSWORD(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: params,
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function deleteBrokersAPI(payload: IPayloadBrokers) {
  const endpoint = PATHS.POST_INDIVIDUAL_METADATA(payload.masterClientId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      clientId: payload.clientUuid,
      brokers: payload.brokers,
      partial: true,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode) && data) {
    return response.data?.client;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function getApprovalMetadataAPI(
  payload: IPayloadGetApprovalMetadata
) {
  const { uuid, session } = payload;

  const endpoint = PATHS.GET_APPROVAL_METADATA(uuid, session);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'GET',
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode) && data) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function approvalMetadataAPI(payload: IPayloadApproveMetadata) {
  const { clientId, tempId } = payload;

  const endpoint = PATHS.APPROVE_METADATA(clientId, tempId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function rejectMetadataAPI(payload: IPayloadRejectMetadata) {
  const { clientId, tempId, reason } = payload;

  const endpoint = PATHS.REJECT_METADATA(clientId, tempId);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: {
      reason,
    },
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function sendWelcomeEmailAPI(payload: IPayloadSendWelcomeEmail) {
  const { uuid } = payload;

  const endpoint = PATHS.SEND_WELCOME_EMAIL(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
  });

  const { statusCode, message, data } = response;

  if ([200, 201].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

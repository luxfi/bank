import { dataFetch } from '@/api/fetchers';

import {
  IPayloadUpdateBusinessAddress,
  IPayloadUpdateBusinessDetailsOfRegistrar,
  IPayloadUpdateIndividualAddress,
  IPayloadUpdateIndividualEmploymentDetails,
  IPayloadUpdateIndividualPersonalDetails,
  PATHS,
} from './types';

export async function updateIndividualPersonalDetailsAPI(
  payload: IPayloadUpdateIndividualPersonalDetails
) {
  const { uuid, ...body } = payload;
  const endpoint = PATHS.UPDATE_INDIVIDUAL_PERSONAL_DETAILS(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateIndividualAddressAPI(
  payload: IPayloadUpdateIndividualAddress
) {
  const { uuid, ...body } = payload;
  const endpoint = PATHS.UPDATE_INDIVIDUAL_ADDRESS(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateIndividualEmploymentDetailsAPI(
  payload: IPayloadUpdateIndividualEmploymentDetails
) {
  const { uuid, ...body } = payload;
  const endpoint = PATHS.UPDATE_INDIVIDUAL_EMPLOYMENT_DETAILS(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateBusinessAddressAPI(
  payload: IPayloadUpdateBusinessAddress
) {
  const { uuid, ...body } = payload;
  const endpoint = PATHS.UPDATE_BUSINESS_ADDRESS(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

export async function updateBusinessDetailsOfRegistrarAPI(
  payload: IPayloadUpdateBusinessDetailsOfRegistrar
) {
  const { uuid, ...body } = payload;
  const endpoint = PATHS.UPDATE_INDIVIDUAL_PERSONAL_DETAILS(uuid);

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'POST',
    bodyParams: body,
  });

  const { statusCode, message, data } = response;

  if ([200].includes(statusCode)) {
    return data;
  }

  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

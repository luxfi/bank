import {
  ERoutingCodesNames,
  IBeneficiaryDetailsResponse,
  IBeneficiaryListResponse,
} from '@/models/beneficiaries';
import { IPaginationResponse } from '@/models/pagination';

import { dataFetch } from './fetchers';
import { BENEFICIARIES } from './paths';

interface IResponse {
  statusCode: number;
  message?: string;
}

interface IGetBeneficiariesListResponse extends IResponse {
  data?: Array<IBeneficiaryListResponse>;
}

interface IBeneficiaryProps {
  endpoint: string;
  isCalledServer?: boolean;
}

export async function getBeneficiariesList(
  params: IBeneficiaryProps
): Promise<IGetBeneficiariesListResponse> {
  const response = await dataFetch({
    endpoint: params.endpoint,
    method: 'GET',
    isCalledServer: params.isCalledServer,
  });

  const { statusCode, data, message } = response;

  if (data) {
    return {
      statusCode,
      data: data ?? [],
      message,
    };
  }

  return {
    statusCode: statusCode ?? 500,
    message: message ?? 'Server error',
    data: [],
  };
}

export async function getBeneficiariesRecentPaid(
  isCalledServer?: boolean
): Promise<IGetBeneficiariesListResponse> {
  const response = await dataFetch({
    endpoint: BENEFICIARIES.RECENT_PAID,
    method: 'GET',
    isCalledServer: isCalledServer,
  });

  const { statusCode, data, message } = response;

  if (data) {
    return {
      statusCode,
      data: data ?? [],
      message,
    };
  }

  return {
    statusCode: statusCode ?? 500,
    message: message ?? 'Server error',
    data: [],
  };
}

interface IGetBeneficiaryDetailsResponse extends IResponse {
  data: IBeneficiaryDetailsResponse;
}

export async function getBeneficiaryDetails(
  uuid: string,
  isCalledServer?: boolean
): Promise<IGetBeneficiaryDetailsResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.BY_ID(uuid),
      method: 'GET',
      isCalledServer,
    });

    const { statusCode, data, message } = response;

    if (data) {
      return {
        statusCode,
        data,
        message,
      };
    }
    throw new Error(message ?? 'Unable to getBeneficiary');
  } catch (error) {
    throw new Error('Unable to getBeneficiary');
  }
}

export async function updateBeneficiary(
  uuid: string,
  dto: any
): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.UPDATE(uuid),
      method: 'POST',
      bodyParams: { ...dto },
    });

    const { statusCode, message } = response;

    if (statusCode === 200) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Update Beneficiary');
  } catch (error) {
    throw new Error('Unable to Update Beneficiary');
  }
}

export async function deleteBeneficiary(uuid: string): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.DELETE(uuid),
      method: 'DELETE',
    });

    const { statusCode, message } = response;

    if ([201, 200].includes(statusCode)) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Delete Beneficiary');
  } catch (error) {
    throw new Error('Unable to Delete Beneficiary');
  }
}

export async function approveBeneficiary(uuid: string): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.APPROVE(uuid),
      method: 'POST',
    });

    const { statusCode, data } = response;

    if ([201, 200].includes(statusCode)) {
      return {
        message: data?.messages?.join?.('\n'),
        statusCode,
      };
    }

    throw new Error(
      data?.messages?.join('\n') || 'Unable to Approve Beneficiary'
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function disapproveBeneficiary(uuid: string): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.DISAPPROVE(uuid),
      method: 'POST',
    });

    const { statusCode, message } = response;

    if ([201, 200].includes(statusCode)) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Approve Beneficiary');
  } catch (error) {
    throw new Error('Unable to Approve Beneficiary');
  }
}

interface IBeneficiaryDTO {
  firstName: string;
  lastName: string;
  companyName: string;
  entityType: string;
  currency: string;
  bankCountry: string;
  routingCodes: Array<{
    name: ERoutingCodesNames;
    value: string;
  }>;
  city: string;
  state: string;
  address: string;
  addressLine2?: string;
  country: string;
  postCode?: string;
}

export async function createBeneficiary(
  data: IBeneficiaryDTO,
  beneficiaryId?: string
): Promise<IResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.CREATE(beneficiaryId),
      method: beneficiaryId ? 'PUT' : 'POST',
      bodyParams: {
        ...data,
      },
    });

    const { statusCode, message } = response;

    if (
      [200, 201].includes(statusCode) ||
      response.data?.id ||
      response.data?.beneficiary?.id
    ) {
      return {
        message,
        statusCode,
      };
    }

    throw new Error(message ?? 'Unable to Create Beneficiary');
  } catch (error) {
    throw new Error('Unable to Create Beneficiary');
  }
}

export interface IGetBeneficiaryListResponse extends IResponse {
  data: Array<IBeneficiaryListResponse>;
}

export async function getBeneficiaryCurrenciesList(
  currency: string,
  isCalledServer?: boolean
): Promise<IGetBeneficiariesListResponse> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.CURRENCY(currency),
      method: 'GET',
      isCalledServer: isCalledServer,
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200 && data) {
      return {
        message,
        statusCode,
        data: data,
      };
    }

    throw new Error(message ?? 'Unable to Get Beneficiary Currencies List');
  } catch (error) {
    throw new Error('Unable to Get Beneficiary Currencies List');
  }
}

interface IBeneficiaryReview extends IResponse {
  data: any;
}
export async function beneficiaryReview(dto: any): Promise<IBeneficiaryReview> {
  try {
    const response = await dataFetch({
      endpoint: BENEFICIARIES.REVIEW,
      method: 'POST',
      bodyParams: {
        ...dto,
      },
    });

    const { statusCode, message, data } = response;

    if (statusCode === 200) {
      return {
        message,
        statusCode,
        data,
      };
    }

    throw new Error(message ?? 'Unable to Review Beneficiary');
  } catch (error) {
    throw new Error('Unable to Review Beneficiary');
  }
}

// ---
export async function getBeneficiaries(params?: unknown): Promise<{
  data: Array<IBeneficiaryListResponse>;
  pagination: IPaginationResponse;
}> {
  const endpoint = BENEFICIARIES.LIST;

  const response = await dataFetch({
    endpoint: endpoint,
    method: 'GET',
    urlParams: params as unknown as Record<string, string>,
  });

  if (response?.data) {
    return {
      data: response.data as Array<IBeneficiaryListResponse>,
      pagination: response.pagination as IPaginationResponse,
    };
  }

  const { message } = response;
  throw new Error(Array.isArray(message) ? message.join(', ') : message ?? '');
}

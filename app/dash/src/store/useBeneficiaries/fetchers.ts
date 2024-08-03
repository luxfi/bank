import { IBeneficiaryListResponse } from '@/models/beneficiaries';
import { IPaginationResponse } from '@/models/pagination';

import { IBeneficiariesFilters } from '@/app/(app)/beneficiaries/type';

import { dataFetch } from '@/api/fetchers';

import { IBeneficiariesResponse, PATHS } from './types';

export async function getBeneficiariesAPI(
  payload?: IBeneficiariesFilters
): Promise<IBeneficiariesResponse> {
  try {
    const response = await dataFetch({
      endpoint: PATHS.GET_BENEFICIARIES,
      method: 'GET',
      urlParams: payload as unknown as Record<string, string>,
    });

    if (response.message) {
      throw new Error('Unable to get Beneficiaries');
    }

    return {
      data: response.data as Array<IBeneficiaryListResponse>,
      pagination: response.pagination as IPaginationResponse,
    };
  } catch (error) {
    throw new Error('Unable to get Beneficiaries');
  }
}

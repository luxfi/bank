import { ISortingPagination } from '@/components/Table';

import { IBeneficiaryListResponse } from '@/models/beneficiarie';
import { IPaginationResponse } from '@/models/pagination';

import { IBeneficiariesFilters } from '@/app/(app)/beneficiaries/type';

import { IDefaultStates } from '../helpers/setStates';

export interface IBeneficiariesResponse {
  data: Array<IBeneficiaryListResponse>;
  pagination: IPaginationResponse;
}
export interface IBeneficiariesStates
  extends IDefaultStates<IBeneficiariesActions> {}

export interface IBeneficiariesActions {
  getBeneficiaries: (
    payload: IBeneficiariesFilters & ISortingPagination
  ) => Promise<IBeneficiariesResponse>;
}

export const PATHS = {
  GET_BENEFICIARIES: '/api/v2/beneficiaries',
};

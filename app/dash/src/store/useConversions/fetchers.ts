import { dataFetch } from '@/api/fetchers';

import {
  IConversionPayload,
  IConversionPreviewResponse,
  IConversionResponse,
  PATHS,
} from './types';

export const postConversionPreviewAPI = async (
  payload: IConversionPayload
): Promise<IConversionPreviewResponse> => {
  try {
    const response = await dataFetch<IConversionPreviewResponse>({
      method: 'POST',
      endpoint: PATHS.CONVERSION_PREVIEW,
      bodyParams: {
        ...payload,
      },
    });

    const { statusCode } = response;

    if (![200, 201].includes(statusCode)) {
      throw new Error(
        (response?.data as any).messages[0] ?? 'Error on preview conversion1'
      );
    }

    return response.data as unknown as IConversionPreviewResponse;
  } catch (error) {
    throw new Error((error as any)?.message ?? 'Error on preview conversion2');
  }
};

export const postConversionAPI = async (
  payload: IConversionPayload
): Promise<IConversionResponse> => {
  const response = await dataFetch<IConversionResponse>({
    method: 'POST',
    endpoint: PATHS.CONVERSION_CREATE,
    bodyParams: {
      ...payload,
    },
  });

  if (response.statusCode === 201 && response.data) {
    return response.data;
  }

  throw new Error(
    (response?.data as any)?.message ?? 'Error on preview conversion'
  );
};

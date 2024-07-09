import { IPaginationResponse } from '@/models/pagination';

import { getFetchBaseClient } from './client';
import { getFetchBaseServer } from './server';
import { IFetchParams, buildPath } from './types';

interface IResponse<T> {
  data?: T;
  message?: string;
  messages?: Array<string>;
  statusCode: number;
  pagination?: IPaginationResponse;
}

export async function dataFetch<T = any>(
  config: IFetchParams
): Promise<IResponse<T>> {
  const fetchBase = config?.isCalledServer
    ? await getFetchBaseServer()
    : await getFetchBaseClient();

  let url = fetchBase.baseURL;

  url += buildPath({
    endpoint: config.endpoint,
    params: config?.urlParams,
  });

  const response = await fetch(url, {
    ...fetchBase.options,
    method: config.method,
    body: config?.bodyParams && JSON.stringify(config?.bodyParams),
    next: config?.revalidate ? { revalidate: config.revalidate } : undefined,
    cache: config?.cache,
  });

  const dataResponse = await response.json();

  const {
    data,
    message,
    statusCode = response.status,
    pagination,
  } = dataResponse;

  return {
    data: data ?? dataResponse,
    message: message,
    statusCode: statusCode,
    pagination: pagination,
  };
}

import { getFetchBaseClient } from "./client";
import { IFetchParams, buildPath } from "./types";

interface IResponse<T> {
  data?: T;
  message?: string;
  statusCode: number;
}

export async function dataFetch<T = any>(
  config: IFetchParams
): Promise<IResponse<T>> {
  const fetchBase = await getFetchBaseClient();

  let url = fetchBase.baseURL;

  url += buildPath({
    endpoint: config.endpoint,
    params: config?.urlParams,
  });

  const response = await fetch(url, {
    ...fetchBase.options,
    method: config.method,
    body: config?.bodyParams && JSON.stringify(config?.bodyParams),
  });

  const { data, message, statusCode } = await response.json();

  return {
    data: data,
    message: message,
    statusCode: statusCode,
  };
}

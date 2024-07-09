import { addParamsToPath } from '@/utils/lib';

type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface IFetchParams {
  endpoint: string;
  method: TMethod;
  cache?: RequestCache;
  revalidate?: number;
  urlParams?: Record<string, string | number>;
  bodyParams?: Record<any, any>;
  isCalledServer?: boolean;
}

export interface IFetchBase {
  options: RequestInit;
  baseURL: string;
}

interface IUrlProps {
  endpoint: string;
  params?: Record<string, string | number>;
}

export function buildPath(config: IUrlProps) {
  const path = config?.params
    ? addParamsToPath({
        params: config?.params,
        path: config.endpoint,
      })
    : config.endpoint;

  return path;
}

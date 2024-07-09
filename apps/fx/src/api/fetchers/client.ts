import Cookies from 'js-cookie';

import { IFetchBase } from './types';

export async function getFetchBaseClient(): Promise<IFetchBase> {
  const token = Cookies.get(process.env.NEXT_PUBLIC_JWT_COOKIE ?? '');
  const path = process.env.NEXT_PUBLIC_BASE_URL || '';

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return {
    options: options,
    baseURL: path,
  };
}

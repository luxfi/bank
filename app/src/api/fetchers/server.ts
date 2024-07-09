'use server';

import { cookies } from 'next/headers';

import { IFetchBase } from './types';

export async function getFetchBaseServer(): Promise<IFetchBase> {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.JWT_COOKIE ?? '')?.value;

  const path = process.env.BASE_URL || '';

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  return {
    options: options,
    baseURL: path,
  };
}

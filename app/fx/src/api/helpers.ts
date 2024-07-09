import { Constants } from '@/lib/constants';

import Cookies from 'js-cookie';

const apiCall = (endpoint: string, options: RequestInit) => {
  const token = Cookies.get(Constants.JWT_COOKIE_NAME);

  options.headers = {
    Accept: 'application/json',
    ...options.headers,
  } as { [key: string]: string };

  if (!(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
  }

  if (token && !options.headers.Authorization) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  const gateway = window.localStorage.getItem('gateway') || 'currencycloud';
  endpoint = endpoint.replace('currencycloud', gateway);
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
    ...options,
  });
};
export { apiCall as fetch };
// eslint-disable-next-line prettier/prettier


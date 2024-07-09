const CLIENTS = process.env.DEMO_CLIENT_ID?.split(',') || [];

export const isDemoAccount = (clientId: string) => {
  return CLIENTS.includes(clientId);
};

export const getConfigCurrencyCloud = (clientId?: string) => {
  if (clientId && isDemoAccount(clientId)) {
    console.log(':: Using demo account ::', clientId);
    return {
      baseUrl: `${process.env.CURRENCY_CLOUD_DEMO_BASE_URL}`,
      loginId: `${process.env.CURRENCY_CLOUD_DEMO_ID}`,
      apiKey: `${process.env.CURRENCY_CLOUD_DEMO_API_KEY}`,
    };
  } else {
    return {
      baseUrl: `${process.env.CURRENCY_CLOUD_BASE_URL}`,
      loginId: `${process.env.CURRENCY_CLOUD_ID}`,
      apiKey: `${process.env.CURRENCY_CLOUD_API_KEY}`,
    };
  }
};

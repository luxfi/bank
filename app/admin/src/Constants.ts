import { LUX_BRAND } from '@luxbank/brand';

const { domains } = LUX_BRAND;

const Constants = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  HOMEPAGE_URL: `https://${domains.primary}/`,
  PRIVACY_POLICY_URL: '/privacy_policy',
  TERMS_OF_SERVICE_URL: '/terms_and_conditions',
  REGISTRATION_HELP: `https://${domains.support}/help/getting-started`,
  JWT_COOKIE_NAME: 'lux-jwt',
  CREATE_A_PAYMENT_URL: '#',
  HELP_CENTRE_URL: `https://${domains.support}/`,
};

export default Constants;

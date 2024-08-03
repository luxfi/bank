export const getRoutingCodePlaceholderByCountry = (
  country: string | undefined,
  currency: string | undefined
) => {
  switch (country) {
    case 'GB':
    case 'IM':
    case 'GI':
    case 'GG':
    case 'JE':
      if (currency == 'GBP') {
        return '123456';
      } else {
        return '';
      }
    case 'US':
      return '123456789';
    case 'DE':
      return '12345678';
    case 'AU':
      return '123456';
    case 'XX':
      return 'Branch Code';
    case 'MX':
      return '123456789012345678';
    case 'CN':
      return '123456789012';
    case 'IN':
      return '12345678901';
    default:
      break;
  }
  return '';
};
export const getRoutingCodeNameByCountry = (
  country: string | undefined,
  currency: string | undefined
) => {
  switch (country) {
    case 'IM':
    case 'GB':
    case 'GI':
    case 'GG':
    case 'JE':
      if (currency == 'GBP') {
        return 'Sort code';
      } else {
        return '';
      }
    /*case 'US':
      return 'ABA / Routing code';
    case 'DE':
      return 'BLZ Code';
    case 'AU':
      return 'BSB Code';
    case 'XX':
      return 'Branch Code';
    case 'MX':
      return 'CLABE';
    case 'CN':
      return 'CTN';
    case 'IN':
      return 'IFSC Code';*/
    default:
      break;
  }
  return '';
};
export function hasAccountBicCombination(country = '') {
  return ['NZ', 'AU', 'US', 'CA', 'PH'].includes(country.toUpperCase());
}
export function isInUk(country = '') {
  return ['GB', 'IM', 'GI', 'GG', 'JE'].includes(country.toUpperCase());
}
export function isSwift(country = '') {
  return [
    'BH',
    'NZ',
    'PH',
    'SG',
    'ZA',
    'TH',
    'VN',
    'KH',
    'BO',
    'IO',
    'MX',
    'AU',
    'CA',
    'IN',
    'JP',
    'RU',
    'US',
  ].includes(country.toUpperCase());
}
export function isIBAN(country = '') {
  return ![
    'NZ',
    'PH',
    'SG',
    'ZA',
    'TH',
    'VN',
    'KH',
    'BO',
    'IO',
    'MX',
    'AU',
    'CA',
    'IN',
    'JP',
    'RU',
    'US',
  ].includes(country.toUpperCase());
}

export function isInUk(country = '') {
    return ['GB', 'IM'].includes(country.toUpperCase());
}

export function isSwift(country = '') {
    return [
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
  
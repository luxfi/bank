import { countriesArray } from '@/models/countries';

import dayjs from 'dayjs';

interface IAddParamsToPageProps {
  params: Record<string, any>;
  path: string;
}

export const countriesOptions = Object.entries(countriesArray).map(
  (c: [string, string]) => {
    return {
      label: c[1],
      value: c[0],
    };
  }
);

export function addParamsToPath(data: IAddParamsToPageProps) {
  Object.entries(data.params).forEach(([key, value]) => {
    if (!value) {
      delete data.params[key];
    }
  });
  const queryString = Object.keys(data.params)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data.params[key])}`
    )
    .join('&');

  return `${data.path}?${queryString}`;
}

/**
 * Formats the given date string to the format 'D MMM YYYY'.
 * @param {string} dateString - The date string in the format 'YYYY-MM-DDTHH:mm:ss.sssZ'.
 * @returns {string} The formatted date string in the format 'D MMM YYYY'.
 */
export function formatDate(dateString: string): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function onlyNumber(text: string) {
  return text.replace(/[^0-9.,]/g, '');
}

export function objectToQueryParams(obj: Record<string, any>): string {
  const queryParams = Object.entries(obj)
    .filter(([, value]) => !!value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
  return queryParams;
}

export function convertMapInOptionList(
  data: Map<string, string>
): Array<{ label: string; value: string }> {
  const list: Array<{ label: string; value: string }> = [];

  data.forEach((value, key) => {
    list.push({
      label: value,
      value: key,
    });
  });

  return list;
}

export function formatDateStringDateISOString(data?: string): string {
  return data ? dayjs(data).format('YYYY-MM-DDTHH:mm:ss.SSSZ') : '';
}

export function formatDateStringShortDate(data?: string): string {
  return data ? dayjs(data).format('YYYY-MM-DD') : '';
}

export function formatDateAndTime(
  data?: string
): { date: string; time: string } | null {
  const date = dayjs(data).format('YYYY-MM-DD');
  const time = dayjs(data).format('HH:mm a');

  if (date === 'Invalid Date') {
    return null;
  }

  return {
    date,
    time,
  };
}

export function formattedDate(data: string, format: string) {
  return dayjs(data).format(format);
}

export const renderSplitText = (text: string, className?: string) => {
  const paragraph = text.split('\n').map((data, index) => (
    <span className={className} key={index}>
      {data}
      <br />
    </span>
  ));

  return paragraph;
};

export function ucFirst(string: string | undefined) {
  return string
    ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    : string;
}

export function snakeToWords(string: string) {
  if (!string) return string;
  const words = string.split('_');
  const newWords = words.map((word) => ucFirst(word));
  return newWords.join(' ');
}

export function wordsToDash(string: string) {
  if (!string) return string;
  const words = string.split(' ');
  const newWords = words.map((word) => word.toLocaleLowerCase());
  return newWords.join('-');
}

/**
 * @param phoneNumber: string - ex +5521999999999
 * @returns string: +55 21 99999-9999
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith('+')) {
    phoneNumber = phoneNumber.replace(/\+|\s/g, '');
    return phoneNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 $2 $3-$4');
  } else {
    phoneNumber = phoneNumber.replace(/\D/g, '');
    return phoneNumber.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }
}

/**
 * @param phone string - ex.: +55 21 99999-9999
 * @returns string: *******-9999
 */
export function censorPhoneNumber(phone: string): string {
  const countryCodeRegex = /^\+\d{2}\s?/;
  const cleanedPhone = phone.replace(countryCodeRegex, '');

  const dashIndex = cleanedPhone.lastIndexOf('-');

  if (dashIndex !== -1) {
    const numbersAfterDash = cleanedPhone
      .substring(dashIndex + 1)
      .replace(/\D/g, '');
    const numbersBeforeDash = cleanedPhone
      .substring(0, dashIndex)
      .replace(/\D/g, '');
    const censoredPart = '*'.repeat(numbersBeforeDash.length);
    return `${censoredPart}-${numbersAfterDash}`;
  } else {
    return cleanedPhone;
  }
}

export function objectIsEmpty(obj: Record<any, any>) {
  return Object.keys(obj).length === 0;
}

export const formatCurrency = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formatter.format(value).replace('$', '');
};

export function formatNumberCurrency(value: string) {
  const allowedNumber = value.replace(/[^\d.]/g, '');

  const split = allowedNumber.split('.');

  const wholeParts = split[0];
  const decimalParts = split.length > 1 ? `.${split[1]}` : '';

  const decimalPartsLimited = decimalParts.slice(0, 3);

  const numberFormatted = `${wholeParts}${decimalPartsLimited}`;

  return numberFormatted;
}

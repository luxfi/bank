import { BadRequestException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { normalizeText } from './format-text';

export interface IFXError {
  messages: Messages;
  message?: string;
}

export interface Messages {
  [key: string]: string;
}

export class IFXErrorResponse extends BadRequestException {
  constructor(error: AxiosError<IFXError>) {
    const msgs = error?.response?.data?.messages || {};
    const msg = error?.response?.data?.message;
    console.log(':: IFXErrorResponse ::', error);
    super({
      messages: msg
        ? [msg]
        : Object.values(msgs).map(
            (e, i) => `${normalizeText(Object.keys(msgs)[i])}: ${e}`,
          ) || ['Error on ifx'],
    });
  }
}

import { BadRequestException } from '@nestjs/common';
import { AxiosError } from 'axios';

export interface CurrencyCloudError {
  messages: Messages;
}

export interface Messages {
  [key: string]: string;
}

interface ErrorMessage {
  code: string;
  message: string;
}

interface ErrorResponse {
  error_code: string;
  error_messages: Record<string, ErrorMessage[]>;
}

export class CurrencyCloudErrorResponse extends BadRequestException {
  constructor(error: AxiosError<CurrencyCloudError>) {
    const response = error.response as { data: ErrorResponse } | undefined;
    let result: string[] = [];
    if (response && response.data) {
      const errors = response.data;

      Object.entries(errors.error_messages).forEach(
        ([field, fieldMessages]) => {
          const messageArray = fieldMessages as ErrorMessage[];
          messageArray?.forEach((fieldMessage) => {
            console.log(`Code: ${fieldMessage.code}, Message: ${fieldMessage.message}`);
            result = [...result, `${fieldMessage.message}`];
          });
        }
      );
    }
    
    super({messages: Object.values(result || error?.response?.data?.messages || {}) || ['Error on currencycloud']});
  }
}

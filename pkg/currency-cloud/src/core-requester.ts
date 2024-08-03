import { BadRequestException, Logger } from '@nestjs/common';
import { GenericAbstraction, propertiesToSnakeCase, getConfigCurrencyCloud } from '@luxbank/misc';
import { User } from '@luxbank/models';
import axios, { AxiosResponse } from 'axios';

interface ErrorMessage {
  code: string;
  message: string;
}

interface ErrorResponse {
  error_code: string;
  error_messages: Record<string, ErrorMessage[]>;
}

export class CoreRequester extends GenericAbstraction {
  protected token: string;
  private loginId: string;
  protected tokenCreatedAt: Date | null;

  constructor(protected readonly logger: Logger) {
    super();
  }

  protected async getRequest<T = any>( endpoint: string, headers: Record<string, string> = {}, user: User, requestParams: Record<string, any> = {} ): Promise<T> {
    const params = { ...requestParams };

    if (user?.getCurrentClient()?.account?.gatewayId)
      params.on_behalf_of = user?.getCurrentClient()?.account?.gatewayId;

    const { baseUrl, apiKey, loginId } = getConfigCurrencyCloud(user.getCurrentClient()?.uuid);

    if (endpoint !== 'authenticate/api')
      headers['X-Auth-Token'] = await this.login(baseUrl, loginId, apiKey);

    const uri = `${baseUrl}/${endpoint}`;

    try {
      const response: AxiosResponse<T> = await axios.get<T>(uri, {headers, params});

      return response.data;
    } 
    catch (error) {
      this.logger.error(uri, (error as any).message, (error as any).stack);
      throw error;
    }
  }

  protected catchError(error: any): never {
    const response = error.response as { data: ErrorResponse } | undefined;
    let result: string[] = [];

    if (response && response.data) {
      const errors = response.data;

      Object.entries(errors.error_messages).forEach(
        ([field, fieldMessages]) => {
          const messageArray = fieldMessages as ErrorMessage[];
          messageArray.forEach((fieldMessage) => {
            console.log(`Code: ${fieldMessage.code}, Message: ${fieldMessage.message}`);
            result = [
              ...result,
              `${fieldMessage.code}, Message: ${fieldMessage.message}`,
            ];
          });
        }
      );
    }

    throw new BadRequestException({ message: result });
  }

  protected isTokenExpired() {
    return (!this.tokenCreatedAt || new Date().valueOf() - this.tokenCreatedAt.valueOf() > 1000 * 60 * 30);
  }

  private async logout(baseUrl: string): Promise<void> {
    if (!this.token) 
        return;

    try {
      const headers: Record<string, string> = {};
      headers['X-Auth-Token'] = this.token;

      this.tokenCreatedAt = null;
      this.token = '';

      await axios.post(`${baseUrl}/authenticate/close_session`, null, {headers});
    } 
    catch (err) {
      this.logger.error(`Logging out failed: ${(err as Error).message}`);
    }
  }

  private async login(baseUrl: string, loginId: string, apiKey: string) {
    if (!this.isTokenExpired() && loginId === this.loginId)
      return this.token;

    if (this.token && loginId === this.loginId)
      await this.logout(baseUrl);

    try {
      const { data } = await axios.post(`${baseUrl}/authenticate/api`, {...propertiesToSnakeCase({loginId,apiKey})});

      this.token = data.auth_token;
      this.tokenCreatedAt = new Date();
      this.loginId = loginId;
      return data.auth_token;
    } 
    catch (error) {
      this.logger.error(`Login failed: ${(error as Error).message}`);
      throw error;
    }
  }

  protected async postRequest(endpoint: string, data: Record<string, any> = {}, headers: Record<string, string> = {}, user: User, params: Record<string, any> = {}) {
    const { baseUrl, apiKey, loginId } = getConfigCurrencyCloud(user.getCurrentClient()?.uuid);
    const extraData: { on_behalf_of?: string } = {};

    if (user?.getCurrentClient()?.account?.gatewayId)
      extraData.on_behalf_of = user?.getCurrentClient()?.account?.gatewayId;

    if (endpoint !== 'authenticate/api')
      headers['X-Auth-Token'] = await this.login(baseUrl, loginId, apiKey);

    const uri = `${baseUrl}/${endpoint}`;

    try {
      const response = await axios.post(
        uri,
        { ...propertiesToSnakeCase(data), ...extraData },
        {
          headers,
          params
        }
      );
      return response;
    } 
    catch (error) {
      this.logger.error(uri, (error as any).message, (error as any).stack);
      throw error;
    }
  }
}

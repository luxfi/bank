import { Logger } from '@nestjs/common';
import { AxiosOAuthClient } from './oauth-client';
import { AxiosRequestConfig } from 'axios';
import { GenericAbstraction, decrypt } from '@tools/misc';
import { User } from '@tools/models';

export class CoreRequester extends GenericAbstraction {
  logger = new Logger(CoreRequester.name);

  private axiosOAuthClient: AxiosOAuthClient;

  constructor(user: User) {
    super();
    const enCredentials = user.getCurrentClient()?.account?.credentials;
    if (enCredentials) {
      const credentials = JSON.parse(decrypt(enCredentials));
      this.axiosOAuthClient = new AxiosOAuthClient(user.uuid, {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        username: credentials.username,
        password: credentials.password,
      });
    }
  }

  public async get(url: string, config?: AxiosRequestConfig) {
    try {
      const responseData = await this.axiosOAuthClient.axiosInstance.get(
        url,
        config,
      );
      return responseData;
    } catch (error) {
      console.log('Error get request:', error);
      this.logger.error('Error get request:', error);
      throw error;
    }
  }

  public async post(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const responseData = await this.axiosOAuthClient.axiosInstance.post(
        url,
        data,
        config,
      );
      return responseData;
    } catch (error) {
      this.logger.error('Error post request:', error);
      throw error;
    }
  }

  public async delete(url: string, config?: AxiosRequestConfig) {
    try {
      const responseData = await this.axiosOAuthClient.axiosInstance.delete(
        url,
        config,
      );
      return responseData;
    } catch (error) {
      this.logger.error('Error delete request:', error);
      throw error;
    }
  }

  public async patch(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const responseData = await this.axiosOAuthClient.axiosInstance.patch(
        url,
        data,
        config,
      );
      return responseData;
    } catch (error) {
      this.logger.error('Error patch request:', error);
      throw error;
    }
  }

  public async put(url: string, data: any, config?: AxiosRequestConfig) {
    try {
      const responseData = await this.axiosOAuthClient.axiosInstance.put(
        url,
        data,
        config,
      );
      return responseData;
    } catch (error) {
      this.logger.error('Error put request:', error);
      throw error;
    }
  }
}

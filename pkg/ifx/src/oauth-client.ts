import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

export interface BasePaths {
  tokenUrl: string;
  baseUrl: string;
}

export interface Session {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export class AxiosOAuthClient {
  public axiosInstance: AxiosInstance;
  private oauthConfig: OAuthConfig & BasePaths;
  private userUuid: string;
  private session: any; //Session;

  constructor(userUuid: string, oauthConfig: OAuthConfig) {
    this.oauthConfig = {
      ...oauthConfig,
      tokenUrl: `${process.env.IFX_BASE_URL}/oauth/token`,
      baseUrl: `${process.env.IFX_BASE_URL}`
    };
    this.userUuid = userUuid;
    this.session = {};

    this.axiosInstance = axios.create({baseURL: this.oauthConfig.baseUrl});
    this.axiosInstance.interceptors.request.use(this.requestInterceptor.bind(this), (error) => Promise.reject(error));
  }

  private async authenticate(): Promise<void> {
    try {
      let newToken;
      if (
        this.session[this.userUuid]?.accessToken &&
        this.session[this.userUuid]?.refreshToken &&
        this.session[this.userUuid]?.expiresAt &&
        Date.now() >= this.session[this.userUuid]?.expiresAt
      ) {
        newToken = await this.refreshToken();
      } else {
        newToken = await this.requestAccessToken();
      }

      this.session[this.userUuid] = {};
      this.session[this.userUuid].accessToken = newToken.access_token;
      this.session[this.userUuid].refreshToken = newToken.refresh_token;
      this.session[this.userUuid].expiresAt =
        Date.now() + newToken.expires_in * 1000;
    } catch (error) {
      console.error(error);
      throw new Error('Authentication failed');
    }
  }

  private async refreshToken(): Promise<any> {
    const response = await axios.post(
      this.oauthConfig.tokenUrl,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.session[this.userUuid].refreshToken as string,
        client_id: this.oauthConfig.clientId,
        client_secret: this.oauthConfig.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  private async requestAccessToken(): Promise<any> {
    const response = await axios.post(
      this.oauthConfig.tokenUrl,
      new URLSearchParams({
        grant_type: 'password',
        client_id: this.oauthConfig.clientId,
        client_secret: this.oauthConfig.clientSecret,
        username: this.oauthConfig.username,
        password: this.oauthConfig.password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  }

  private async requestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
    await this.authenticate();

    if (this.session[this.userUuid]?.accessToken)
      config.headers.authorization = `Bearer ${this.session[this.userUuid].accessToken}`;

    return config;
  }

  async isValidCredentials(): Promise<boolean> {
    try {
      await this.requestAccessToken();
      return true;
    } 
    catch (error) {
      return false;
    }
  }
}

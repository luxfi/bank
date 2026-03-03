import axios, {type AxiosInstance} from 'axios';
import type {IamConfig} from './config';

export interface IamUser {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  type: string;
  isAdmin: boolean;
  signupApplication: string;
  createdTime: string;
  properties: Record<string, string>;
}

export interface IamTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
  scope: string;
}

export interface IamIntrospectionResponse {
  active: boolean;
  sub?: string;
  client_id?: string;
  scope?: string;
  exp?: number;
  iat?: number;
}

export class IamClient {
  private readonly http: AxiosInstance;
  private readonly config: IamConfig;

  constructor(config: IamConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: config.issuer,
      timeout: 10000,
    });
  }

  /** Exchange authorization code for tokens */
  async exchangeCode(code: string, redirectUri: string): Promise<IamTokenResponse> {
    const {data} = await this.http.post('/oauth/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    return data;
  }

  /** Refresh an access token */
  async refreshToken(refreshToken: string): Promise<IamTokenResponse> {
    const {data} = await this.http.post('/oauth/token', new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    return data;
  }

  /** Get user info from access token */
  async getUserInfo(accessToken: string): Promise<IamUser> {
    const {data} = await this.http.get('/oauth/userinfo', {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    return data;
  }

  /** Introspect a token (check validity) */
  async introspectToken(token: string): Promise<IamIntrospectionResponse> {
    const {data} = await this.http.post('/oauth/introspect', new URLSearchParams({
      token,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    return data;
  }

  /** Revoke a token */
  async revokeToken(token: string): Promise<void> {
    await this.http.post('/oauth/revoke', new URLSearchParams({
      token,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
  }

  /** Get a user by their ID */
  async getUser(userId: string): Promise<IamUser> {
    const {data} = await this.http.get(`/api/get-user`, {
      params: {id: `${this.config.organization}/${userId}`},
      auth: {
        username: this.config.clientId,
        password: this.config.clientSecret,
      },
    });
    return data;
  }

  /** Check if a user has a specific permission */
  async enforce(sub: string, obj: string, act: string): Promise<boolean> {
    const {data} = await this.http.post('/api/enforce', {
      id: `${this.config.organization}/built-in`,
      v0: sub,
      v1: obj,
      v2: act,
    }, {
      auth: {
        username: this.config.clientId,
        password: this.config.clientSecret,
      },
    });
    return data === true || data?.data === true;
  }

  /** Build the OAuth2 authorization URL */
  getAuthorizationUrl(redirectUri: string, state?: string, scope = 'openid profile email'): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: redirectUri,
      scope,
      ...(state ? {state} : {}),
    });
    return `${this.config.issuer}/oauth/authorize?${params}`;
  }

  /** Get OIDC discovery document */
  async getDiscovery(): Promise<Record<string, any>> {
    const {data} = await this.http.get('/.well-known/openid-configuration');
    return data;
  }
}

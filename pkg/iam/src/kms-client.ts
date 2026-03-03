import axios, {type AxiosInstance} from 'axios';
import type {KmsConfig} from './config';

export interface KmsKey {
  id: string;
  name: string;
  algorithm: string;
  keySize: number;
  status: 'active' | 'disabled' | 'destroyed';
  createdAt: string;
  rotatedAt?: string;
}

export interface EncryptResponse {
  ciphertext: string;
  keyId: string;
  algorithm: string;
}

export interface DecryptResponse {
  plaintext: string;
  keyId: string;
}

export interface SignResponse {
  signature: string;
  keyId: string;
  algorithm: string;
}

export class KmsClient {
  private readonly http: AxiosInstance;

  constructor(config: KmsConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /** Create a new encryption key */
  async createKey(name: string, algorithm = 'AES-256-GCM'): Promise<KmsKey> {
    const {data} = await this.http.post('/api/v1/keys', {name, algorithm});
    return data;
  }

  /** List all keys */
  async listKeys(): Promise<KmsKey[]> {
    const {data} = await this.http.get('/api/v1/keys');
    return data.keys || data;
  }

  /** Encrypt data using a named key */
  async encrypt(keyId: string, plaintext: string): Promise<EncryptResponse> {
    const {data} = await this.http.post(`/api/v1/keys/${keyId}/encrypt`, {
      plaintext: Buffer.from(plaintext).toString('base64'),
    });
    return data;
  }

  /** Decrypt data using a named key */
  async decrypt(keyId: string, ciphertext: string): Promise<DecryptResponse> {
    const {data} = await this.http.post(`/api/v1/keys/${keyId}/decrypt`, {ciphertext});
    return {
      ...data,
      plaintext: Buffer.from(data.plaintext, 'base64').toString('utf8'),
    };
  }

  /** Sign data using a named key */
  async sign(keyId: string, message: string): Promise<SignResponse> {
    const {data} = await this.http.post(`/api/v1/keys/${keyId}/sign`, {
      message: Buffer.from(message).toString('base64'),
    });
    return data;
  }

  /** Verify a signature */
  async verify(keyId: string, message: string, signature: string): Promise<boolean> {
    const {data} = await this.http.post(`/api/v1/keys/${keyId}/verify`, {
      message: Buffer.from(message).toString('base64'),
      signature,
    });
    return data.valid === true;
  }

  /** Rotate a key */
  async rotateKey(keyId: string): Promise<KmsKey> {
    const {data} = await this.http.post(`/api/v1/keys/${keyId}/rotate`);
    return data;
  }
}

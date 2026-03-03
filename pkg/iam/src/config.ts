export interface IamConfig {
  /** IAM server URL (e.g., https://lux.id) */
  issuer: string;
  /** JWKS URI for JWT validation */
  jwksUri: string;
  /** OAuth2 client ID for this application */
  clientId: string;
  /** OAuth2 client secret */
  clientSecret: string;
  /** Organization name in IAM */
  organization: string;
  /** Application name in IAM */
  application: string;
}

export interface KmsConfig {
  /** KMS server URL (e.g., https://kms.lux.network) */
  baseUrl: string;
  /** API key or service account token for KMS */
  apiKey: string;
}

export interface MpcConfig {
  /** MPC server URL (e.g., https://mpc.lux.network) */
  baseUrl: string;
  /** API key for MPC operations */
  apiKey: string;
}

export interface LuxSecurityConfig {
  iam: IamConfig;
  kms?: KmsConfig;
  mpc?: MpcConfig;
}

export function resolveConfig(overrides?: Partial<LuxSecurityConfig>): LuxSecurityConfig {
  const defaults = createDefaultConfig();
  return {
    iam: { ...defaults.iam, ...overrides?.iam },
    kms: overrides?.kms ?? defaults.kms,
    mpc: overrides?.mpc ?? defaults.mpc,
  };
}

export function createDefaultConfig(): LuxSecurityConfig {
  return {
    iam: {
      issuer: process.env.IAM_ISSUER || 'https://lux.id',
      jwksUri: process.env.IAM_JWKS_URI || `${process.env.IAM_ISSUER || 'https://lux.id'}/.well-known/jwks`,
      clientId: process.env.IAM_CLIENT_ID || '',
      clientSecret: process.env.IAM_CLIENT_SECRET || '',
      organization: process.env.IAM_ORGANIZATION || 'lux',
      application: process.env.IAM_APPLICATION || 'lux-bank',
    },
    kms: process.env.KMS_BASE_URL
      ? {
          baseUrl: process.env.KMS_BASE_URL || 'https://kms.lux.network',
          apiKey: process.env.KMS_API_KEY || '',
        }
      : undefined,
    mpc: process.env.MPC_BASE_URL
      ? {
          baseUrl: process.env.MPC_BASE_URL || 'https://mpc.lux.network',
          apiKey: process.env.MPC_API_KEY || '',
        }
      : undefined,
  };
}

import { DynamicModule, Global, Module } from '@nestjs/common';
import { IamClient } from './iam-client';
import { KmsClient } from './kms-client';
import { MpcClient } from './mpc-client';
import { type LuxSecurityConfig, resolveConfig } from './config';

export const IAM_CLIENT = 'IAM_CLIENT';
export const KMS_CLIENT = 'KMS_CLIENT';
export const MPC_CLIENT = 'MPC_CLIENT';

@Global()
@Module({})
export class IamModule {
  static forRoot(config?: Partial<LuxSecurityConfig>): DynamicModule {
    const resolved = resolveConfig(config);

    const providers = [
      {
        provide: IAM_CLIENT,
        useFactory: () => new IamClient(resolved.iam),
      },
      ...(resolved.kms
        ? [{ provide: KMS_CLIENT, useFactory: () => new KmsClient(resolved.kms!) }]
        : []),
      ...(resolved.mpc
        ? [{ provide: MPC_CLIENT, useFactory: () => new MpcClient(resolved.mpc!) }]
        : []),
    ];

    return {
      module: IamModule,
      providers,
      exports: providers.map((p) => p.provide),
    };
  }
}

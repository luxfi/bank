import { DynamicModule, Global, Module } from '@nestjs/common';
import { IamClient } from './iam-client';
import { KmsClient } from './kms-client';
import { MpcClient } from './mpc-client';
import { BrokerClient } from './broker-client';
import { CommerceClient } from './commerce-client';
import { type LuxSecurityConfig, resolveConfig } from './config';

export const IAM_CLIENT = 'IAM_CLIENT';
export const KMS_CLIENT = 'KMS_CLIENT';
export const MPC_CLIENT = 'MPC_CLIENT';
export const BROKER_CLIENT = 'BROKER_CLIENT';
export const COMMERCE_CLIENT = 'COMMERCE_CLIENT';

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
      ...(resolved.broker
        ? [{ provide: BROKER_CLIENT, useFactory: () => new BrokerClient(resolved.broker!) }]
        : []),
      ...(resolved.commerce
        ? [{ provide: COMMERCE_CLIENT, useFactory: () => new CommerceClient(resolved.commerce!) }]
        : []),
    ];

    return {
      module: IamModule,
      providers,
      exports: providers.map((p) => p.provide),
    };
  }
}

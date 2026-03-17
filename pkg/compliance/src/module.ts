// Copyright 2024-2026 Lux Partners Limited. All rights reserved.

import { DynamicModule, Global, Module } from '@nestjs/common';
import { ComplianceService } from './service';
import type { ComplianceConfig } from './types';

export const COMPLIANCE_CONFIG = 'COMPLIANCE_CONFIG';

@Global()
@Module({})
export class ComplianceModule {
  static forRoot(config: ComplianceConfig): DynamicModule {
    return {
      module: ComplianceModule,
      providers: [
        { provide: COMPLIANCE_CONFIG, useValue: config },
        ComplianceService,
      ],
      exports: [ComplianceService],
    };
  }
}

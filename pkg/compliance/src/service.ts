// Copyright 2024-2026 Lux Partners Limited. All rights reserved.

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ComplianceClient } from './client';
import type {
  Application,
  ApplicationStats,
  Alert,
  ComplianceConfig,
  CreateApplicationRequest,
  JurisdictionInfo,
  KYCStatus,
  KYCVerification,
  MonitoringResult,
  PaymentDecision,
  PaymentRequest,
  ScreeningRequest,
  ScreeningResult,
  TransactionData,
} from './types';
import { COMPLIANCE_CONFIG } from './module';

@Injectable()
export class ComplianceService {
  private readonly client: ComplianceClient;
  private readonly logger = new Logger(ComplianceService.name);

  constructor(@Inject(COMPLIANCE_CONFIG) config: ComplianceConfig) {
    this.client = new ComplianceClient(config);
    this.logger.log(`Compliance client configured for ${config.baseUrl}`);
  }

  /** Create a new compliance application. */
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    return this.client.createApplication(data);
  }

  /** Retrieve a single application by ID. */
  async getApplication(id: string): Promise<Application> {
    return this.client.getApplication(id);
  }

  /** Partially update an existing application. */
  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    return this.client.updateApplication(id, data);
  }

  /** Submit a draft application for review. */
  async submitApplication(id: string): Promise<Application> {
    return this.client.submitApplication(id);
  }

  /** List applications, optionally filtered by status. */
  async listApplications(status?: string): Promise<Application[]> {
    return this.client.listApplications(status);
  }

  /** Get aggregate application statistics. */
  async getStats(): Promise<ApplicationStats> {
    return this.client.getStats();
  }

  /** Initiate KYC identity verification for an application. */
  async initiateKYC(applicationId: string, provider?: string): Promise<KYCVerification> {
    return this.client.initiateKYC(applicationId, provider);
  }

  /** Get KYC verification status by verification ID. */
  async getKYCStatus(verificationId: string): Promise<KYCStatus> {
    return this.client.getKYCStatus(verificationId);
  }

  /** Get all KYC verifications for an application. */
  async getKYCByApplication(applicationId: string): Promise<KYCStatus[]> {
    return this.client.getKYCByApplication(applicationId);
  }

  /** Screen an individual against sanctions and watchlists. */
  async screenIndividual(data: ScreeningRequest): Promise<ScreeningResult> {
    return this.client.screenIndividual(data);
  }

  /** Monitor a transaction for AML rule violations. */
  async monitorTransaction(data: TransactionData): Promise<MonitoringResult> {
    return this.client.monitorTransaction(data);
  }

  /** Get AML alerts, optionally filtered by status. */
  async getAlerts(status?: string): Promise<Alert[]> {
    return this.client.getAlerts(status);
  }

  /** Validate a payment against compliance rules. */
  async validatePayment(data: PaymentRequest): Promise<PaymentDecision> {
    return this.client.validatePayment(data);
  }

  /** Get jurisdiction requirements and limits by ISO country code. */
  async getJurisdiction(code: string): Promise<JurisdictionInfo> {
    return this.client.getJurisdiction(code);
  }
}

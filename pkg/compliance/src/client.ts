// Copyright 2024-2026 Lux Partners Limited. All rights reserved.

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
import { ComplianceError } from './types';

const DEFAULT_TIMEOUT = 30_000;

export class ComplianceClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(config: ComplianceConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
  }

  // --- Applications ---

  /** Create a new compliance application. */
  async createApplication(data: CreateApplicationRequest): Promise<Application> {
    return this.post<Application>('/v1/applications', data);
  }

  /** Retrieve a single application by ID. */
  async getApplication(id: string): Promise<Application> {
    return this.get<Application>(`/v1/applications/${enc(id)}`);
  }

  /** Partially update an existing application. */
  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    return this.patch<Application>(`/v1/applications/${enc(id)}`, data);
  }

  /** Submit a draft application for review. */
  async submitApplication(id: string): Promise<Application> {
    return this.post<Application>(`/v1/applications/${enc(id)}/submit`, {});
  }

  /** List applications, optionally filtered by status. */
  async listApplications(status?: string): Promise<Application[]> {
    const qs = status ? `?status=${enc(status)}` : '';
    return this.get<Application[]>(`/v1/applications${qs}`);
  }

  /** Get aggregate application statistics. */
  async getStats(): Promise<ApplicationStats> {
    return this.get<ApplicationStats>('/v1/applications/stats');
  }

  // --- KYC ---

  /** Initiate KYC identity verification for an application. */
  async initiateKYC(applicationId: string, provider?: string): Promise<KYCVerification> {
    const body: Record<string, string> = { application_id: applicationId };
    if (provider) {
      body.provider = provider;
    }
    return this.post<KYCVerification>('/v1/kyc/verify', body);
  }

  /** Get KYC verification status by verification ID. */
  async getKYCStatus(verificationId: string): Promise<KYCStatus> {
    return this.get<KYCStatus>(`/v1/kyc/status/${enc(verificationId)}`);
  }

  /** Get all KYC verifications for an application. */
  async getKYCByApplication(applicationId: string): Promise<KYCStatus[]> {
    return this.get<KYCStatus[]>(`/v1/kyc/application/${enc(applicationId)}`);
  }

  // --- AML ---

  /** Screen an individual against sanctions and watchlists. */
  async screenIndividual(data: ScreeningRequest): Promise<ScreeningResult> {
    return this.post<ScreeningResult>('/v1/aml/screen', data);
  }

  /** Monitor a transaction for AML rule violations. */
  async monitorTransaction(data: TransactionData): Promise<MonitoringResult> {
    return this.post<MonitoringResult>('/v1/aml/monitor', data);
  }

  /** Get AML alerts, optionally filtered by status. */
  async getAlerts(status?: string): Promise<Alert[]> {
    const qs = status ? `?status=${enc(status)}` : '';
    return this.get<Alert[]>(`/v1/aml/alerts${qs}`);
  }

  // --- Payments ---

  /** Validate a payment against compliance rules. */
  async validatePayment(data: PaymentRequest): Promise<PaymentDecision> {
    return this.post<PaymentDecision>('/v1/payments/validate', data);
  }

  // --- Regulatory ---

  /** Get jurisdiction requirements and limits by ISO country code. */
  async getJurisdiction(code: string): Promise<JurisdictionInfo> {
    return this.get<JurisdictionInfo>(`/v1/regulatory/${enc(code)}`);
  }

  // --- Internal HTTP helpers ---

  private async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  private async patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'X-Api-Key': this.apiKey,
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ComplianceError(`Request timed out after ${this.timeout}ms: ${method} ${path}`, 0);
      }
      throw new ComplianceError(
        `Network error: ${err instanceof Error ? err.message : String(err)}`,
        0,
      );
    } finally {
      clearTimeout(timer);
    }

    let data: unknown;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      throw new ComplianceError(
        `Invalid JSON response: ${method} ${path} ${res.status}`,
        res.status,
        text,
      );
    }

    if (!res.ok) {
      const msg =
        data && typeof data === 'object' && 'error' in data
          ? (data as { error: string }).error
          : `HTTP ${res.status}`;
      throw new ComplianceError(msg, res.status, data);
    }

    return data as T;
  }
}

function enc(s: string): string {
  return encodeURIComponent(s);
}

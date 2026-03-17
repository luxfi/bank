// Copyright 2024-2026 Lux Partners Limited. All rights reserved.

// --- Configuration ---

export interface ComplianceConfig {
  /** Base URL of the compliance service (e.g. http://compliance:8091) */
  baseUrl: string;
  /** X-Api-Key header value for authentication */
  apiKey: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

// --- Application lifecycle ---

export type ApplicationStatus = 'draft' | 'pending' | 'pending_kyc' | 'approved' | 'rejected';

export type KYCStatusValue = 'not_started' | 'pending' | 'verified' | 'failed';

export interface Document {
  id: string;
  type: string;
  sub_type?: string;
  file_name?: string;
  mime_type?: string;
  status?: string;
  uploaded_at: string;
}

export interface Application {
  id: string;
  org_id?: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  submitted_at?: string;

  // Applicant identity
  given_name: string;
  family_name: string;
  date_of_birth?: string;
  email: string;
  phone?: string;

  // Address
  street?: string[];
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;

  // Tax & regulatory
  tax_id?: string;
  tax_id_type?: string;
  country_of_tax_residence?: string;

  // Disclosures
  is_control_person?: boolean;
  is_affiliated_exchange_or_finra?: boolean;
  is_politically_exposed?: boolean;
  immediate_family_exposed?: boolean;

  // Employment
  employment_status?: string;
  employer_name?: string;
  employer_address?: string;
  job_title?: string;

  // Financial
  annual_income?: string;
  net_worth?: string;
  liquid_net_worth?: string;
  funding_source?: string;
  investment_objective?: string;

  // Account preferences
  account_type?: string;
  enabled_assets?: string[];
  provider?: string;

  // KYC state
  kyc_status: KYCStatusValue;
  kyc_provider?: string;
  kyc_reference?: string;
  kyc_result?: string;
  kyc_verified_at?: string;

  // Documents
  documents?: Document[];

  // Admin notes
  review_notes?: string;
  reviewed_by?: string;

  // Source tracking
  source?: string;
  ip_address?: string;
  meta?: Record<string, string>;
}

export type CreateApplicationRequest = Omit<
  Application,
  'id' | 'status' | 'created_at' | 'updated_at' | 'kyc_status'
> & {
  status?: ApplicationStatus;
  kyc_status?: KYCStatusValue;
};

export interface ApplicationStats {
  total: number;
  draft: number;
  pending: number;
  pending_kyc: number;
  approved: number;
  rejected: number;
  kyc_not_started: number;
  kyc_pending: number;
  kyc_verified: number;
  kyc_failed: number;
}

// --- KYC Verification ---

export type VerificationStatus = 'pending' | 'approved' | 'declined' | 'expired' | 'error';

export interface KYCVerification {
  verification_id: string;
  provider: string;
  status: VerificationStatus;
  redirect_url?: string;
  created_at: string;
}

export interface KYCCheck {
  type: string;
  status: string;
  detail?: string;
}

export interface KYCStatus {
  id: string;
  application_id: string;
  org_id?: string;
  provider: string;
  status: VerificationStatus;
  redirect_url?: string;
  risk_score?: number;
  checks?: KYCCheck[];
  raw_result?: unknown;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// --- AML Screening ---

export type MatchType = 'exact' | 'fuzzy' | 'partial';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ListSource = 'ofac_sdn' | 'eu_sanctions' | 'uk_hmt' | 'pep' | 'adverse_media';

export interface ScreeningRequest {
  id?: string;
  given_name: string;
  family_name: string;
  date_of_birth?: string;
  country?: string;
  nationality?: string;
  tax_id?: string;
  email?: string;
  lists?: ListSource[];
}

export interface ScreeningMatch {
  list: ListSource;
  match_type: MatchType;
  score: number;
  matched_name: string;
  list_id?: string;
  details?: string;
  country?: string;
}

export interface ScreeningResult {
  id: string;
  request_id?: string;
  risk: RiskLevel;
  matches: ScreeningMatch[];
  screened_at: string;
  total_checks: number;
  clear: boolean;
}

// --- AML Transaction Monitoring ---

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'open' | 'investigating' | 'escalated' | 'closed' | 'filed';
export type RuleType = 'single_amount' | 'daily_aggregate' | 'velocity' | 'geographic' | 'structuring';

export interface TransactionData {
  id: string;
  account_id: string;
  type: string;
  direction: string;
  amount: number;
  currency: string;
  country?: string;
  counterparty_id?: string;
  counterparty_name?: string;
  timestamp: string;
  description?: string;
  meta?: Record<string, string>;
}

export interface Alert {
  id: string;
  transaction_id: string;
  account_id: string;
  rule_id: string;
  rule_type: RuleType;
  severity: AlertSeverity;
  status: AlertStatus;
  description: string;
  details?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MonitoringResult {
  transaction_id: string;
  allowed: boolean;
  alerts?: Alert[];
  review_required: boolean;
}

// --- Payment Compliance ---

export type PaymentDirection = 'payin' | 'payout';
export type PaymentDecisionValue = 'approve' | 'decline' | 'review';

export interface PaymentRequest {
  id: string;
  direction: PaymentDirection;
  amount: number;
  currency: string;
  country: string;
  account_id: string;
  type: string;

  originator_name?: string;
  originator_account?: string;
  originator_address?: string;
  originator_country?: string;

  beneficiary_name?: string;
  beneficiary_account?: string;
  beneficiary_address?: string;
  beneficiary_country?: string;

  timestamp: string;
}

export interface PaymentRule {
  id: string;
  name: string;
  passed: boolean;
  detail?: string;
}

export interface TravelRuleResult {
  applicable: boolean;
  originator_complete: boolean;
  beneficiary_complete: boolean;
  compliant: boolean;
  detail?: string;
}

export interface PaymentDecision {
  payment_id: string;
  decision: PaymentDecisionValue;
  reasons?: string[];
  warnings?: string[];
  rules_applied: PaymentRule[];
  requires_ctr: boolean;
  requires_sar: boolean;
  travel_rule?: TravelRuleResult;
}

// --- Regulatory / Jurisdiction ---

export interface Requirement {
  id: string;
  category: string;
  description: string;
  mandatory: boolean;
  reference?: string;
}

export interface Violation {
  requirement_id: string;
  field: string;
  message: string;
  severity: string;
}

export interface Limits {
  single_transaction_max: number;
  daily_max: number;
  monthly_max: number;
  annual_max?: number;
  ctr_threshold?: number;
  travel_rule_min: number;
  currency: string;
}

export interface JurisdictionInfo {
  name: string;
  code: string;
  requirements: Requirement[];
  limits: Limits;
}

// --- Errors ---

export class ComplianceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ComplianceError';
    Object.setPrototypeOf(this, ComplianceError.prototype);
  }
}

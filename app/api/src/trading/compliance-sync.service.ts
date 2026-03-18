import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientsRepository, Account, RiskAssessment, Client } from '@luxbank/tools-models';

interface CexCompliancePayload {
  jurisdiction: string;
  country: string;
  client_type: string;
  kyc_level: number;
  aml_cleared: boolean;
  accredited: boolean;
  professional: boolean;
  sanctioned: boolean;
  max_order_size: number;
  daily_limit: number;
  pep_status: string | null;
  source_of_funds: string | null;
  sof_verified: boolean;
  adverse_media: boolean;
  high_risk_country: boolean;
  edd_required: boolean;
  tax_residency: string | null;
  entity_id: string | null;
}

@Injectable()
export class ComplianceSyncService implements OnModuleInit {
  private readonly logger = new Logger(ComplianceSyncService.name);
  private cexBaseUrl: string;
  private cexApiKey: string;
  private syncEnabled: boolean;

  constructor(
    @Optional() private readonly clientsRepository: ClientsRepository,
    private readonly configService: ConfigService,
  ) {
    this.cexBaseUrl = this.configService.get<string>('CEX_BASE_URL', 'http://localhost:8080');
    this.cexApiKey = this.configService.get<string>('CEX_API_KEY', '');
    this.syncEnabled = this.configService.get<string>('CEX_SYNC_ENABLED', 'false') === 'true';
  }

  onModuleInit() {
    if (this.syncEnabled) {
      this.logger.log(`Compliance sync enabled -> ${this.cexBaseUrl}`);
    }
  }

  async syncAccountToCex(client: Client): Promise<boolean> {
    if (!this.syncEnabled) return false;

    const account = client.account;
    if (!account) {
      this.logger.warn(`Client ${client.uuid} has no account, skipping CEX sync`);
      return false;
    }

    const payload = this.buildCompliancePayload(client, account);
    const accountId = account.uuid;

    try {
      const res = await fetch(
        `${this.cexBaseUrl}/api/v1/accounts/${accountId}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.cexApiKey ? { 'Authorization': `Bearer ${this.cexApiKey}` } : {}),
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const body = await res.text();
        this.logger.error(`CEX sync failed for ${accountId}: ${res.status} ${body}`);
        return false;
      }

      this.logger.log(`CEX sync OK for ${accountId}`);
      return true;
    } catch (err) {
      this.logger.error(`CEX sync error for ${accountId}: ${err}`);
      return false;
    }
  }

  async syncRiskAssessmentToCex(client: Client, risk: RiskAssessment): Promise<boolean> {
    if (!this.syncEnabled) return false;

    const account = client.account;
    if (!account) return false;

    // Update account-level flags from risk assessment
    const sanctioned = risk.getDataValue('sanction') === 'yes';
    const adverseMedia = risk.getDataValue('adverseInformation') === 'yes';
    const pepStatus = risk.getDataValue('pep') || null;

    if (sanctioned !== account.sanctioned
      || adverseMedia !== account.adverseMedia
      || pepStatus !== account.pepStatus) {
      account.sanctioned = sanctioned;
      account.adverseMedia = adverseMedia;
      if (pepStatus) account.pepStatus = pepStatus;
      await account.save();
    }

    return this.syncAccountToCex(client);
  }

  private buildCompliancePayload(client: Client, account: Account): CexCompliancePayload {
    const jurisdiction = client.getJurisdiction();
    const country = client.getCoutry() || '';

    return {
      jurisdiction,
      country: country.toUpperCase(),
      client_type: account.tradingClientType || 'individual',
      kyc_level: account.kycLevel || 0,
      aml_cleared: account.amlCleared || false,
      accredited: this.computeAccreditationStatus(account),
      professional: account.professional || false,
      sanctioned: account.sanctioned || false,
      max_order_size: account.maxOrderSize || 0,
      daily_limit: account.dailyTradingLimit || 0,
      pep_status: account.pepStatus || null,
      source_of_funds: account.sourceOfFunds || null,
      sof_verified: account.sofVerified || false,
      adverse_media: account.adverseMedia || false,
      high_risk_country: account.highRiskCountry || false,
      edd_required: account.eddRequired || false,
      tax_residency: account.taxResidency || null,
      entity_id: account.uuid,
    };
  }

  private computeAccreditationStatus(account: Account): boolean {
    if (account.accredited) return true;

    // US SEC: $1M+ net worth (excluding primary residence) OR $200K+ annual income
    const income = account.annualIncome || 0;
    const netWorth = account.netWorth || 0;
    if (income >= 200_000 || netWorth >= 1_000_000) return true;

    return false;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async syncAllAccounts() {
    if (!this.syncEnabled) return;

    this.logger.log('Starting scheduled compliance sync to CEX');
    let synced = 0;
    let failed = 0;

    try {
      if (!this.clientsRepository) {
        this.logger.warn('ClientsRepository not available — skipping sync');
        return;
      }
      const clients = await this.clientsRepository.findAll();
      for (const client of clients) {
        try {
          const ok = await this.syncAccountToCex(client);
          if (ok) synced++;
          else failed++;
        } catch {
          failed++;
        }
      }
    } catch (err) {
      this.logger.error(`Scheduled sync error: ${err}`);
    }

    this.logger.log(`Compliance sync complete: ${synced} synced, ${failed} failed`);
  }
}

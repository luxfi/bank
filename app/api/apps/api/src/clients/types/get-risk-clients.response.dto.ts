export class RiskAssessment {
  clientId?: string;
  userId?: string;
  id?: string;
  name: string;
  type: string;
  riskRating: string;
  lastRA: string;
  nextRA: string;
  PEP: boolean;
  country: string;
}

export class ClientSelectRiskPaginatedResponse {
  data: RiskAssessment[];
  pagination?: {
    totalEntries?: number;
    totalPages?: number;
    page: number;
    limit: number;
  };
}

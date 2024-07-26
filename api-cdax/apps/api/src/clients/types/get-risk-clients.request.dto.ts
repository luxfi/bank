export class GetRiskClientsRequestPaginated {
    type?: string;
    country?: string;
    riskRating?: string;
    pep?: boolean;
    page?: number;
    limit?: number;
}

export class GetRiskClientsRequest {
    page: number;
    limit: number;
}

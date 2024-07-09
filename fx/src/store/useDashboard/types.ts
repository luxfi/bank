import { IDefaultStates } from '../helpers/setStates';

export interface IDashboardStates extends IDefaultStates<IDashboardActions> {}

export interface IDashboardActions {
  getSuperAdminDashboardInfo(): Promise<ISuperAdminDashboardInfoReponse>;
  getUserDashboardInfo(): Promise<IUserDashboardInfo>;
}

export interface ISuperAdminDashboardInfoReponse {
  beneficiariesPending: number;
  clientsForApproval: number;
  riskAssessmentPending: number;
  lastTransactionsIn30Days: number;
}

export interface IUserDashboardInfo {
  expiredApproval: number;
  transactions: number;
  pendingApproval: number;
  awaitingFunds: number;
  failedPayments: number;
  rejectedPayments: number;
  completedConversions: number;
  completedPayments: number;
  completedTransactions: number;
  pendingTransactions: number;
  lastThirtyDaysTransactions: number;
}

export const PATHS = {
  USER_DASHBOARD_INFO: '/api/v1/currencycloud/dashboard-info',
  SUPER_ADMIN_DASHBOARD_INFO: '/api/v1/admin/clients/dashboard-info',
};

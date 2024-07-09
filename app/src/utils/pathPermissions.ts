import { UserRole } from '@/models/auth';

import { APP_PATHS } from '@/app/paths';

type TPaths =
  | 'WITHOUT_AUTH'
  | 'BASE_APP'
  | 'APP_ADMIN'
  | 'APP_SUPER_ADMIN'
  | 'APP_TEAM_MANAGER'
  | 'APP_TEAM_MEMBER'
  | 'APP_TEAM_VIEWER';

export const withoutAuth = [
  '/',
  '/',
  '/2fa',
  '/forgot-password',
  '/registration',
  '/registration/success',
];

const baseRoutes = [
  '/dashboard',
  '/beneficiaries',
  '/users',
  '/transactions',
  '/manage-account',
  '/about',
];

const teamMemberRoutes = [
  '/create-payment',
  '/conversion',
  '/balances',
  'https://www.cdaxforex.com/help-centre/',
  '/payment',
  APP_PATHS.IN_APPROVAL.ROOT,
];

const teamViewerRoutes = [
  '/balances',
  '/wallet',
  'https://www.cdaxforex.com/help-centre/',
  '/payment',
  APP_PATHS.IN_APPROVAL.ROOT,
];

const teamManagerRoutes = [
  '/create-payment',
  '/conversion',
  '/wallet',
  '/invite-users',
  '/balances',
  'https://www.cdaxforex.com/help-centre/',
  '/payment',
  APP_PATHS.IN_APPROVAL.ROOT,
];

const adminRoutes = [
  '/create-payment',
  '/conversion',
  '/wallet',
  '/invite-users',
  '/balances',
  'https://www.cdaxforex.com/help-centre/',
  '/payment',
  APP_PATHS.IN_APPROVAL.ROOT,
];

const superAdminRoutes = [
  '/documents',
  '/clients',
  '/admin-users',
  '/archived-users',
  'https://cdaxkycuploads.cdaxforex.com/index.php/login',
];

export function getPaths(type: TPaths): Array<string> {
  const paths: Record<TPaths, Array<string>> = {
    APP_TEAM_MEMBER: teamMemberRoutes,
    APP_TEAM_MANAGER: teamManagerRoutes,
    APP_ADMIN: adminRoutes,
    APP_SUPER_ADMIN: superAdminRoutes,
    BASE_APP: baseRoutes,
    WITHOUT_AUTH: withoutAuth,
    APP_TEAM_VIEWER: teamViewerRoutes,
  };

  return paths[type];
}

export function validatePaths(): Record<UserRole, Array<string>> {
  return {
    'admin:super': [...getPaths('BASE_APP'), ...getPaths('APP_SUPER_ADMIN')],
    'user:admin': [...getPaths('BASE_APP'), ...getPaths('APP_ADMIN')],
    'user:manager': [...getPaths('BASE_APP'), ...getPaths('APP_TEAM_MANAGER')],
    'user:member': [...getPaths('BASE_APP'), ...getPaths('APP_TEAM_MEMBER')],
    'user:viewer': [...getPaths('BASE_APP'), ...getPaths('APP_TEAM_VIEWER')],
  };
}

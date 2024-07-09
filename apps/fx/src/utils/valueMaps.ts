import { IBadge } from '@/components/Badge';

import { IIconProps } from '@cdaxfx/ui';

interface IStatusBadge {
  label: string;
  variant: IBadge['variant'];
  icon?: IIconProps['variant'];
}

export const getBadgeStatusValues: Record<string, IStatusBadge> =
  {
    pending: {
      label: 'Pending',
      variant: 'warning',
      icon: 'hourglass',
    },
    done: {
      label: 'Completed',
      variant: 'positive',
      icon: 'check',
    },
    completed: {
      label: 'Completed',
      variant: 'positive',
      icon: 'check',
    },
    rejected: {
      label: 'Rejected',
      variant: 'negative',
      icon: 'cross',
    },
    failed: {
      label: 'Failed',
      variant: 'negative',
      icon: 'cross',
    },
  } || {};

export const getBadgeStatusInApprovalValues: Record<string, IStatusBadge> =
  {
    pending: {
      label: 'In Approval',
      variant: 'warning',
      icon: 'hourglass',
    },
    rejected: {
      label: 'Rejected',
      variant: 'negative',
      icon: 'cross',
    },
    expired: {
      label: 'Expired',
      variant: 'negative',
      icon: 'cross',
    },
  } || {};

export const getUserStatusBadgeValues: Record<string, IStatusBadge> =
  {
    pending: {
      label: 'Pending',
      variant: 'warning',
      icon: 'hourglass',
    },
    approved: {
      label: 'Approved',
      variant: 'positive',
      icon: 'check',
    },
    archived: {
      label: 'Archived',
      variant: 'negative',
      icon: 'archive',
    },
  } || {};

export const getRiskAssesmentStatusBadgeValues: Record<string, IStatusBadge> =
  {
    low: {
      label: 'Low',
      variant: 'positive',
    },
    standard: {
      label: 'Standard',
      variant: 'warning',
    },
    pending: {
      label: 'Pending',
      variant: 'info',
    },
    high: {
      label: 'High',
      variant: 'negative',
    },
  } || {};

/**
 * Customer Configurations
 *
 * White-label customer configurations for demo and production deployments.
 */

export * from './triangle-bank';

import { TRIANGLE_BANK_CONFIG } from './triangle-bank';

export const DEMO_CUSTOMERS = {
  'triangle-bank': TRIANGLE_BANK_CONFIG,
} as const;

export type DemoCustomerId = keyof typeof DEMO_CUSTOMERS;

export function getCustomerConfig(customerId: DemoCustomerId) {
  return DEMO_CUSTOMERS[customerId];
}

export function getDefaultDemoCustomer() {
  return TRIANGLE_BANK_CONFIG;
}

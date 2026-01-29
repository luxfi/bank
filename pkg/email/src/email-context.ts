/**
 * Email Template Context Helper
 *
 * Provides brand configuration data for email templates.
 */

import { LUX_BRAND } from '@luxbank/brand';

/**
 * Base email template context with brand information
 */
export interface EmailBrandContext {
  brandName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  supportEmail: string;
  disclaimer: string;
  legalAddress: string;
  helpUrl: string;
  logoUrl: string;
}

/**
 * Get base brand context for email templates
 */
export function getEmailBrandContext(): EmailBrandContext {
  const { jurisdiction } = LUX_BRAND;
  const address = jurisdiction.legalEntity.registeredAddress;

  return {
    brandName: LUX_BRAND.name,
    tagline: LUX_BRAND.tagline,
    primaryColor: LUX_BRAND.colors.primary,
    accentColor: LUX_BRAND.colors.accent,
    contactEmail: jurisdiction.contact.email,
    contactPhone: jurisdiction.contact.phone,
    supportEmail: jurisdiction.contact.supportEmail,
    disclaimer: jurisdiction.disclaimers.general,
    legalAddress: `${address.line1}, ${address.city}, ${address.postalCode}, ${address.country}`,
    helpUrl: `https://${LUX_BRAND.domains.support}`,
    logoUrl: `https://${LUX_BRAND.domains.primary}/images/lux-logo.svg`,
  };
}

/**
 * Merge brand context with custom context for email templates
 */
export function createEmailContext<T extends Record<string, any>>(
  customContext: T
): EmailBrandContext & T {
  return {
    ...getEmailBrandContext(),
    ...customContext,
  };
}

export default getEmailBrandContext;

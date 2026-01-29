/**
 * @luxbank/brand
 *
 * Centralized brand and jurisdiction configuration for Lux Financial.
 *
 * This package provides:
 * - Multi-jurisdiction regulatory configuration
 * - Brand identity (colors, typography, assets)
 * - Legal entity and compliance information
 * - Email template helpers
 *
 * @example
 * ```ts
 * import { LUX_BRAND, createBrandConfig } from '@luxbank/brand';
 *
 * // Use default brand configuration
 * console.log(LUX_BRAND.name); // "Lux Financial"
 *
 * // Create brand config for a specific jurisdiction
 * const usBrand = createBrandConfig('US_FEDERAL');
 * console.log(usBrand.jurisdiction.regulators); // OCC, FDIC, FinCEN
 *
 * // Access jurisdiction-specific disclaimers
 * console.log(usBrand.jurisdiction.disclaimers.general);
 * ```
 */

// Types
export * from './types';

// Jurisdictions
export * from './jurisdictions';

// Brand Configuration
export {
  LUX_COLORS,
  LUX_COLORS_LIGHT,
  LUX_TYPOGRAPHY,
  LUX_ASSETS,
  LUX_SOCIAL,
  LUX_BRAND,
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_DESCRIPTION,
  createBrandConfig,
} from './config';

// Assets
export * from './assets';

// Demo Customers
export * from './customers';

// Re-export key types for convenience
export type {
  BrandConfig,
  BrandColors,
  BrandTypography,
  BrandAssets,
  BrandSocial,
  JurisdictionCode,
  JurisdictionConfig,
  LegalEntityType,
  Address,
  Regulator,
  EmailTemplateContext,
} from './types';

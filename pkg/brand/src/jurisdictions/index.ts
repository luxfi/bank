/**
 * Jurisdiction Configurations
 *
 * Comprehensive regulatory and legal entity configurations
 * for global financial services operations.
 */

export * from './global';
export * from './us';
export * from './uk';
export * from './eu';
export * from './apac';
export * from './americas';
export * from './mena';

import type { JurisdictionCode, JurisdictionConfig } from '../types';

import { GLOBAL } from './global';
import { US_FEDERAL, US_STATE, US_TRUST, US_FUND, US_SPONSORED } from './us';
import { UK_FCA, UK_IOM, UK_GIB } from './uk';
import { EU_GENERIC, EU_IRELAND, EU_LITHUANIA, EU_MALTA, EU_CYPRUS } from './eu';
import { SG_MAS, HK_SFC, HK_HKMA, AU_ASIC } from './apac';
import { CA_FINTRAC, CA_PROVINCIAL } from './americas';
import { UAE_DFSA, UAE_ADGM } from './mena';

/**
 * All available jurisdictions
 */
export const JURISDICTIONS: Record<JurisdictionCode, JurisdictionConfig> = {
  // Global (default - technology provider)
  GLOBAL,

  // United States
  US_FEDERAL,
  US_STATE,
  US_TRUST,
  US_FUND,
  US_SPONSORED,

  // United Kingdom & Crown Dependencies
  UK_FCA,
  UK_IOM,
  UK_GIB,

  // European Union
  EU_GENERIC,
  EU_IRELAND,
  EU_LITHUANIA,
  EU_MALTA,
  EU_CYPRUS,

  // Asia Pacific
  SG_MAS,
  HK_SFC,
  HK_HKMA,
  AU_ASIC,
  AU_AUSTRAC: AU_ASIC, // Alias

  // Americas
  CA_FINTRAC,
  CA_PROVINCIAL,

  // Middle East
  UAE_DFSA,
  UAE_ADGM,
  UAE_DIFC: UAE_DFSA, // Alias

  // Custom (placeholder for runtime customization)
  CUSTOM: UK_IOM, // Default to IOM as fallback
};

/**
 * Get jurisdiction configuration by code
 */
export function getJurisdiction(code: JurisdictionCode): JurisdictionConfig {
  return JURISDICTIONS[code];
}

/**
 * Get all jurisdiction codes
 */
export function getJurisdictionCodes(): JurisdictionCode[] {
  return Object.keys(JURISDICTIONS) as JurisdictionCode[];
}

/**
 * Get jurisdictions by country code
 */
export function getJurisdictionsByCountry(countryCode: string): JurisdictionConfig[] {
  return Object.values(JURISDICTIONS).filter(j => j.countryCode === countryCode);
}

/**
 * Get jurisdictions by currency
 */
export function getJurisdictionsByCurrency(currency: string): JurisdictionConfig[] {
  return Object.values(JURISDICTIONS).filter(j => j.currency === currency);
}

/**
 * Default jurisdiction (configurable via environment)
 */
export const DEFAULT_JURISDICTION: JurisdictionCode =
  (process.env.DEFAULT_JURISDICTION as JurisdictionCode) || 'GLOBAL';

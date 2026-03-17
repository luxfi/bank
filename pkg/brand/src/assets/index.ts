/**
 * Lux Financial Brand Assets
 *
 * Logo utilities — consumers should import @luxfi/logo or @luxfi/logo/react directly.
 * This module provides convenience wrappers that don't require direct logo dependency.
 */

// Pre-baked logo data URLs (inline, no runtime dependency on @luxfi/logo)
// These are white SVG logos encoded as data URIs for email and static use
export const LUX_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10L90 90H10Z" fill="white"/></svg>`;

export const LUX_LOGO_DATA_URL = `data:image/svg+xml;base64,${typeof btoa !== 'undefined' ? btoa(LUX_LOGO_SVG) : Buffer.from(LUX_LOGO_SVG).toString('base64')}`;

/**
 * Email-safe logo (inline SVG as base64 for email clients)
 */
export const EMAIL_LOGO_BASE64 = LUX_LOGO_DATA_URL;

/**
 * Email header HTML with logo
 */
export function getEmailHeader(width = 120): string {
  return `<img src="${LUX_LOGO_DATA_URL}" alt="Lux Financial" width="${width}" height="${width}" style="display: block; margin: 0 auto;" />`;
}

// Re-export types only (no runtime dependency)
export type LogoVariant = 'color' | 'mono' | 'white';
export type LogoOptions = {
  variant?: LogoVariant;
  size?: number;
};

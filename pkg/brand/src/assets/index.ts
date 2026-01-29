/**
 * Lux Financial Brand Assets
 *
 * Re-exports from @luxfi/logo for unified logo management.
 * All logos are generated programmatically by the logo package.
 */

// Re-export all logo functions and constants from @luxfi/logo
export {
  // SVG generators
  getColorSVG,
  getMonoSVG,
  getWhiteSVG,
  getMenuBarSVG,
  getColorSVGCropped,
  getLogoDataUrl,
  getLogoBase64,
  getLogo,

  // Pre-generated SVG strings
  luxLogo,
  luxLogoMono,
  luxLogoWhite,
  luxLogoDataUrl,
  luxLogoMonoDataUrl,
  luxLogoWhiteDataUrl,
} from '@luxfi/logo';

// Re-export types
export type { LogoVariant, LogoOptions, LogoSettings } from '@luxfi/logo';

// Import for use in functions below
import { luxLogoWhiteDataUrl, getLogoDataUrl } from '@luxfi/logo';

/**
 * Email-safe logo (inline SVG as base64 for email clients)
 * Uses the white variant for dark email backgrounds
 */
export const EMAIL_LOGO_BASE64 = luxLogoWhiteDataUrl;

/**
 * Email header HTML with logo
 */
export function getEmailHeader(width = 120): string {
  return `<img src="${luxLogoWhiteDataUrl}" alt="Lux Financial" width="${width}" height="${width}" style="display: block; margin: 0 auto;" />`;
}

/**
 * Get logo as base64 data URL (legacy compatibility)
 * @deprecated Use getLogoDataUrl from @luxfi/logo directly
 */
export function getLegacyLogoDataUrl(variant: 'white' | 'dark' | 'brand' = 'white'): string {
  switch (variant) {
    case 'dark':
      return getLogoDataUrl({ variant: 'mono' });
    case 'brand':
    case 'white':
    default:
      return getLogoDataUrl({ variant: 'white' });
  }
}

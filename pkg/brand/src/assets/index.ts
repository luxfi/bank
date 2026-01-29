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
  getFaviconSVG,
  getWordmarkSVG,
  getWordmarkGradientSVG,
  getMenuBarSVG,
  getLogoDataUrl,
  getLogoBase64,
  getLogo,

  // Pre-generated SVG strings
  luxLogo,
  luxLogoMono,
  luxLogoWhite,
  luxWordmark,
  luxWordmarkGradient,
  luxLogoDataUrl,
  luxLogoMonoDataUrl,
  luxLogoWhiteDataUrl,

  // React components
  LuxLogo,
  LuxFavicon,
  Wordmark,

  // Alternative names
  LuxfiLogo,
  LuxfiFavicon,
  Logo,
} from '@luxfi/logo';

// Re-export types
export type { LuxLogoProps, LogoVariant, LogoFormat, LogoOptions, LogoSettings } from '@luxfi/logo';

/**
 * Email-safe logo (inline SVG as base64 for email clients)
 * Uses the white variant for dark email backgrounds
 */
export { luxLogoWhiteDataUrl as EMAIL_LOGO_BASE64 } from '@luxfi/logo';

/**
 * Email header HTML with logo
 */
export function getEmailHeader(width = 120): string {
  const { luxLogoWhiteDataUrl } = require('@luxfi/logo');
  return `<img src="${luxLogoWhiteDataUrl}" alt="Lux Financial" width="${width}" height="${width}" style="display: block; margin: 0 auto;" />`;
}

/**
 * Get logo as base64 data URL (legacy compatibility)
 * @deprecated Use getLogoDataUrl from @luxfi/logo directly
 */
export function getLegacyLogoDataUrl(variant: 'white' | 'dark' | 'brand' = 'white'): string {
  const { getLogoDataUrl } = require('@luxfi/logo');

  switch (variant) {
    case 'dark':
      return getLogoDataUrl({ variant: 'mono' });
    case 'brand':
    case 'white':
    default:
      return getLogoDataUrl({ variant: 'white' });
  }
}

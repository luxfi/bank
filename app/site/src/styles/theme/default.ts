import { IThemeType } from "./type";

export const screens = {
  xs: "320px",
  sm: "768px",
  md: "1024px",
  lg: "1200px",
};

export const DeviceSize = {
  xs: `(max-width: ${screens.xs})`,
  sm: `(max-width: ${screens.sm})`,
  md: `(max-width: ${screens.md})`,
  lg: `(max-width: ${screens.lg})`,
};

// Dark theme colors - Pure black with white accents
export const darkColors = {
  // Base backgrounds - Pure black
  background: "#000000",
  surface: "#0A0A0A",
  surfaceHover: "#111111",
  foreground: "rgba(255,255,255,0.92)",

  // Text hierarchy
  primary: "rgba(255,255,255,0.92)",
  secondary: "rgba(255,255,255,0.65)",
  muted: "rgba(255,255,255,0.45)",

  // Borders
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.15)",

  // Accent - White
  accent: "#FFFFFF",
  accentForeground: "#000000",

  // States
  disabled: "rgba(255,255,255,0.25)",
  danger: "#EF4444",
  success: "#22C55E",

  // Legacy compatibility
  label: "rgba(255,255,255,0.65)",
  borderLabel: "rgba(255,255,255,0.08)",
  placeholder: "rgba(255,255,255,0.45)",
  gray: "#0A0A0A",
  black: "#000000",
  detail: "rgba(255,255,255,0.45)",
  sky: "#FFFFFF",
  card: "#0A0A0A",
};

// Light theme colors
export const lightColors = {
  // Base backgrounds
  background: "#FFFFFF",
  surface: "#F8F9FA",
  surfaceHover: "#F1F3F4",
  foreground: "rgba(0,0,0,0.87)",

  // Text hierarchy
  primary: "rgba(0,0,0,0.87)",
  secondary: "rgba(0,0,0,0.60)",
  muted: "rgba(0,0,0,0.38)",

  // Borders
  border: "rgba(0,0,0,0.08)",
  borderHover: "rgba(0,0,0,0.15)",

  // Accent is black
  accent: "#0B0F14",
  accentForeground: "#FFFFFF",

  // States
  disabled: "rgba(0,0,0,0.25)",
  danger: "#DC2626",
  success: "#16A34A",

  // Legacy compatibility
  label: "rgba(0,0,0,0.60)",
  borderLabel: "rgba(0,0,0,0.08)",
  placeholder: "rgba(0,0,0,0.38)",
  gray: "#F8F9FA",
  black: "#0B0F14",
  detail: "rgba(0,0,0,0.38)",
  sky: "#2563EB",
  card: "#FFFFFF",
};

// Generate size values from 2px to 1280px in 8px increments
const generateSizes = (): Record<string, string> => {
  const sizes: Record<string, string> = {
    "2px": "0.125rem",
  };
  for (let i = 8; i <= 1280; i += 8) {
    sizes[`${i}px`] = `${i / 16}rem`;
  }
  return sizes;
};

const size = generateSizes();

export const darkTheme: IThemeType = {
  colors: darkColors,
  size: size as unknown as IThemeType["size"],
};

export const lightTheme: IThemeType = {
  colors: lightColors,
  size: size as unknown as IThemeType["size"],
};

// Default export for backwards compatibility
export const defaultTheme = darkTheme;

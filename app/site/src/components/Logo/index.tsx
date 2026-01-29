"use client";
import { luxLogoWhite, luxLogo, luxLogoMono } from "@luxfi/logo";
import React from "react";

type LogoVariant = "color" | "white" | "mono";

interface LuxLogoProps {
  variant?: LogoVariant;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

const variantMap: Record<LogoVariant, string> = {
  color: luxLogo,
  white: luxLogoWhite,
  mono: luxLogoMono,
};

/**
 * Lux Logo component
 * Uses pre-generated SVG strings from @luxfi/logo
 */
export const LuxLogo: React.FC<LuxLogoProps> = ({
  variant = "color",
  size = 64,
  className,
  style,
}) => {
  const svgString = variantMap[variant];
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={className}
      style={{
        width: sizeValue,
        height: sizeValue,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

export default LuxLogo;

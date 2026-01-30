"use client";
import Link from "next/link";
import { LuxLogo } from "@/components/Logo";
import { LUX_BRAND } from "@luxbank/brand";
import { useThemeMode } from "@/context/ThemeContext";

import {
  BrandSection,
  Column,
  ContentContainer,
  Copyright,
  CopyrightRow,
  DisclaimerText,
  Divider,
  FooterContainer,
  MainGrid,
  NavColumn,
  NavColumns,
  NavLink,
  NavTitle,
  SocialLinks,
} from "./styles";

// Social Icons as inline SVGs
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

// Footer navigation types
interface FooterNavItem {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterNavSection {
  title: string;
  items: FooterNavItem[];
}

const footerNav: Record<string, FooterNavSection> = {
  products: {
    title: "Products",
    items: [
      { label: "Mobile App", href: "/products/mobile" },
      { label: "Exchange", href: "/products/exchange" },
      { label: "DeFi", href: "/products/defi" },
      { label: "Digital Securities", href: "/products/issuance" },
      { label: "Global Payments", href: "/products/cross-border" },
      { label: "Wallets", href: "/products/wallets" },
      { label: "Infrastructure", href: "/products/infrastructure" },
    ],
  },
  company: {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Solutions", href: "/solutions" },
      { label: "Careers", href: "/careers" },
      { label: "Lux Industries", href: "https://luxindustries.xyz", external: true },
    ],
  },
  developers: {
    title: "Developers",
    items: [
      { label: "Documentation", href: "https://docs.lux.financial", external: true },
      { label: "API Reference", href: "https://docs.lux.financial/api-reference", external: true },
      { label: "GitHub", href: "https://github.com/luxfi", external: true },
      { label: "Status", href: "https://status.lux.financial", external: true },
    ],
  },
  research: {
    title: "Research",
    items: [
      { label: "Lux Protocol Specs", href: "https://lps.lux.network", external: true },
      { label: "DAO Governance", href: "https://lps.lux.network/docs/lp-8850", external: true },
      { label: "KMS Architecture", href: "https://lps.lux.network/docs/lp-0070", external: true },
      { label: "Post-Quantum Crypto", href: "https://lps.lux.network/docs/lp-2200", external: true },
    ],
  },
  legal: {
    title: "Legal",
    items: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-and-conditions" },
      { label: "Security", href: "/security" },
    ],
  },
};

export default function Footer() {
  const { jurisdiction } = LUX_BRAND;
  const { mode } = useThemeMode();
  const currentYear = new Date().getFullYear();
  const address = jurisdiction.legalEntity.registeredAddress;

  return (
    <FooterContainer>
      <ContentContainer>
        <MainGrid>
          {/* Brand Section */}
          <BrandSection>
            <Link href="/">
              <LuxLogo
                size={40}
                variant={mode === "dark" ? "white" : "color"}
                style={{ cursor: "pointer" }}
              />
            </Link>
            <Column>
              <p>
                {`${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`}
              </p>
              <p>
                {jurisdiction.contact.email}
              </p>
            </Column>
          </BrandSection>

          {/* Navigation Columns */}
          <NavColumns>
            {Object.entries(footerNav).map(([key, section]) => (
              <NavColumn key={key}>
                <NavTitle>{section.title}</NavTitle>
                {section.items.map((item) => (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </NavColumn>
            ))}
          </NavColumns>
        </MainGrid>

        <Divider />

        {/* Disclaimer */}
        <DisclaimerText>
          {jurisdiction.disclaimers.general}
        </DisclaimerText>

        <Divider />

        {/* Bottom Section */}
        <CopyrightRow>
          <Copyright>
            <a href="https://luxindustries.xyz" target="_blank" rel="noopener noreferrer">
              By Lux Industries
            </a>
            <span>© 2016-{currentYear} {LUX_BRAND.name}</span>
          </Copyright>

          <SocialLinks>
            <a href="https://x.com/luxdefi" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <XIcon />
            </a>
            <a href="https://linkedin.com/company/luxfinancial" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </SocialLinks>
        </CopyrightRow>
      </ContentContainer>
    </FooterContainer>
  );
}

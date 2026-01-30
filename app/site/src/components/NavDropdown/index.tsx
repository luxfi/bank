"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  DropdownContainer,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  SectionTitle,
  DropdownItem,
  ItemIcon,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ChevronIcon,
  FeaturedCard,
  FeaturedTitle,
  FeaturedDescription,
  FeaturedLink,
} from "./styles";

// Icons
const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const FxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ApiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20M6 15h4" />
  </svg>
);

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Platform dropdown content
const platformItems = [
  {
    icon: AccountIcon,
    title: "White-Label Accounts",
    description: "Branded account infrastructure for your platform",
    href: "/account",
  },
  {
    icon: FxIcon,
    title: "Real-time FX API",
    description: "Interbank rates via simple API calls",
    href: "/account",
  },
  {
    icon: GlobeIcon,
    title: "Multi-Currency Wallets",
    description: "34+ currencies with instant conversions",
    href: "/account",
  },
  {
    icon: PaymentIcon,
    title: "Global Payments",
    description: "Send to 37+ countries via SWIFT & local rails",
    href: "/account",
  },
  {
    icon: TrendingIcon,
    title: "Treasury & Hedging",
    description: "Forward contracts up to 12 months",
    href: "/account",
  },
  {
    icon: ShieldIcon,
    title: "Enterprise Security",
    description: "SOC 2 Type II compliant infrastructure",
    href: "/account",
  },
];

// Solutions dropdown content - Lux as "Galileo of DeFi"
const solutionItems = {
  topCustomers: [
    { title: "DeFi Protocols", description: "Fiat on/off ramps & stablecoin infrastructure", href: "/solutions/defi" },
    { title: "Crypto Exchanges", description: "Banking rails, custody & compliance", href: "/solutions/exchanges" },
    { title: "Neobanks & Fintechs", description: "White-label accounts & card issuing", href: "/solutions/neobanks" },
    { title: "Stablecoin Issuers", description: "Mint, redeem & reserve management", href: "/solutions/stablecoins" },
    { title: "Web3 Wallets", description: "Fiat integration & payment rails", href: "/solutions/wallets" },
    { title: "Cross-Border Platforms", description: "Global payments & FX optimization", href: "/solutions/cross-border" },
  ],
  infrastructure: [
    { title: "Orchestration API", description: "Unified API for all payment rails", href: "/products/orchestration" },
    { title: "Multi-Chain Wallets", description: "MPC custody across 8+ chains", href: "/products/wallets" },
    { title: "Stablecoin Rails", description: "USDC, USDT, PYUSD, EURC, USDY", href: "/products/stablecoins" },
    { title: "Banking-as-a-Service", description: "IBANs, accounts & cards", href: "/products/baas" },
    { title: "Compliance Suite", description: "KYC, AML & sanctions screening", href: "/products/compliance" },
    { title: "Treasury Management", description: "FX hedging & yield optimization", href: "/products/treasury" },
  ],
  emerging: [
    { title: "AI & Agents", description: "Autonomous payment infrastructure", href: "/solutions/ai-agents" },
    { title: "RWA Tokenization", description: "Real-world asset settlement", href: "/solutions/rwa" },
    { title: "PayFi", description: "Payment financing & yield", href: "/solutions/payfi" },
    { title: "DAO Treasury", description: "On-chain treasury management", href: "/solutions/dao" },
    { title: "Gaming & Metaverse", description: "In-game economies & payouts", href: "/solutions/gaming" },
    { title: "Creator Platforms", description: "Global creator payouts", href: "/solutions/creators" },
  ],
};

interface NavDropdownProps {
  label: string;
  type: "platform" | "solutions";
  active?: boolean;
}

export default function NavDropdown({ label, type, active }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <DropdownContainer
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownTrigger $active={active || false} $open={isOpen} onClick={handleClick}>
        {label}
        <ChevronIcon $open={isOpen}>
          <ChevronDownIcon />
        </ChevronIcon>
      </DropdownTrigger>

      {isOpen && (
        <DropdownMenu $type={type}>
          {type === "platform" && (
            <>
              <FeaturedCard>
                <FeaturedTitle>Lux Financial Platform</FeaturedTitle>
                <FeaturedDescription>
                  Open-source crypto infrastructure for regulated financial institutions. Institutional-grade.
                </FeaturedDescription>
                <FeaturedLink href="/account">
                  Explore Platform →
                </FeaturedLink>
              </FeaturedCard>
              <DropdownSection>
                <SectionTitle>Products</SectionTitle>
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.title} href={item.href}>
                      <DropdownItem>
                        <ItemIcon>
                          <Icon />
                        </ItemIcon>
                        <ItemContent>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                        </ItemContent>
                      </DropdownItem>
                    </Link>
                  );
                })}
              </DropdownSection>
            </>
          )}

          {type === "solutions" && (
            <>
              <DropdownSection>
                <SectionTitle>Top Customers</SectionTitle>
                {solutionItems.topCustomers.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <BuildingIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
              <DropdownSection>
                <SectionTitle>Infrastructure</SectionTitle>
                {solutionItems.infrastructure.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <ApiIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
              <DropdownSection>
                <SectionTitle>Emerging</SectionTitle>
                {solutionItems.emerging.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <TrendingIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
            </>
          )}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}

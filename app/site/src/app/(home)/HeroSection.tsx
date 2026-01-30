"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
import { DeviceSize } from "@/styles/theme/default";

// Brand accent color - White
const BRAND_COLOR = "#FFFFFF";

// Proof chips data
const PROOF_CHIPS = [
  { label: "CEX + DEX", icon: "exchange" },
  { label: "AMM + DeFi", icon: "chart" },
  { label: "Digital Securities", icon: "doc" },
  { label: "200+ Countries", icon: "globe" },
  { label: "50+ Chains", icon: "link" },
  { label: "Post-Quantum", icon: "shield" },
];

// Dashboard nav items
const DASHBOARD_NAV = [
  { label: "Dashboard", icon: "grid", active: true },
  { label: "Wallets", icon: "wallet" },
  { label: "Payments", icon: "globe" },
  { label: "Exchange", icon: "exchange" },
  { label: "DeFi", icon: "chart" },
  { label: "Securities", icon: "doc" },
];

// Terminal lines
const TERMINAL_LINES = [
  { text: "$ lux login", type: "command" },
  { text: "$ lux balance --all", type: "command" },
  { text: "Fetching balances across 3 chains...", type: "info" },
  { text: "✓ USDC (Polygon): $1,428,500.00", type: "success" },
  { text: "✓ USDT (Ethereum): $876,293.00", type: "success" },
  { text: "✓ BTC (Bitcoin): $542,500.00", type: "success" },
  { text: "Total: $2,847,293.00", type: "highlight" },
  { text: "$ lux pay --to NG --amount 10000 --currency USDC", type: "command" },
  { text: "✓ Payment sent to Nigeria", type: "success" },
  { text: "✓ Settlement: 2 minutes", type: "success" },
];

type MobileTab = "dashboard" | "terminal" | "mobile";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Styled Components
const HeroContainer = styled.section`
  padding: 5rem 1rem 2rem;

  @media ${DeviceSize.md} {
    padding: 4rem 1rem 2rem;
  }

  @media ${DeviceSize.sm} {
    padding: 1rem 1rem 2rem;
  }
`;

const HeroCard = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 700px;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%);

  @media ${DeviceSize.md} {
    min-height: auto;
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
`;

const GlowOrb = styled.div<{ $color?: string; $size?: string; $position?: string; $opacity?: number }>`
  position: absolute;
  ${props => props.$position || 'top: 50%; left: 50%; transform: translate(-50%, -50%);'}
  width: ${props => props.$size || '800px'};
  height: ${props => props.$size || '800px'};
  border-radius: 50%;
  background: radial-gradient(circle, ${props => props.$color || BRAND_COLOR} 0%, transparent 70%);
  filter: blur(100px);
  opacity: ${props => props.$opacity || 0.15};
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px);
  background-size: 60px 60px;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  padding: 2.5rem;

  @media ${DeviceSize.md} {
    padding: 2rem 1.5rem;
  }

  @media ${DeviceSize.sm} {
    padding: 1.5rem 1rem;
  }
`;

// Desktop Layout
const DesktopGrid = styled.div`
  display: none;

  @media (min-width: 1025px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    height: 100%;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

// Tablet Layout
const TabletLayout = styled.div`
  display: none;

  @media (min-width: 769px) and (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

// Mobile Layout
const MobileLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 769px) {
    display: none;
  }
`;

const CopySection = styled.div<{ $center?: boolean }>`
  ${props => props.$center && css`
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  `}
  animation: ${fadeIn} 0.6s ease forwards;
`;

const Badge = styled.span`
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  border: 1px solid ${BRAND_COLOR}40;
  color: ${BRAND_COLOR};
  margin-bottom: 1.5rem;

  @media ${DeviceSize.sm} {
    font-size: 0.7rem;
    padding: 0.375rem 0.75rem;
    margin-bottom: 1rem;
  }
`;

const Headline = styled.h1`
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1.5rem;

  @media ${DeviceSize.lg} {
    font-size: 2.5rem;
  }

  @media ${DeviceSize.md} {
    font-size: 2.25rem;
  }

  @media ${DeviceSize.sm} {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

const HeadlineWhite = styled.span`
  color: white;
`;

const HeadlineGold = styled.span`
  color: ${BRAND_COLOR};
`;

const Subhead = styled.p`
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;

  @media ${DeviceSize.md} {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  @media ${DeviceSize.sm} {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;
    margin-bottom: 1rem;

    a {
      width: 100%;
      max-width: 200px;
    }
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  background: ${BRAND_COLOR};
  color: #000;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  svg {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  background: transparent;
  color: white;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
`;

const ChipsRow = styled.div<{ $center?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  ${props => props.$center && 'justify-content: center;'}
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }

  @media ${DeviceSize.sm} {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;

    svg {
      width: 0.625rem;
      height: 0.625rem;
    }
  }
`;

// Tab Selector
const TabSelector = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const TabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.625rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;

  ${props => props.$active ? css`
    background: ${BRAND_COLOR};
    color: #000;
  ` : css`
    background: transparent;
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      color: white;
    }
  `}
`;

// Mock Components
const MockContainer = styled.div`
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.95);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const BrowserChrome = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.3);
`;

const BrowserDots = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color};
`;

const UrlBar = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const UrlBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-family: ui-monospace, monospace;
`;

const DashboardBody = styled.div`
  display: flex;
  min-height: 280px;

  @media ${DeviceSize.sm} {
    min-height: 240px;
  }
`;

const Sidebar = styled.div`
  width: 140px;
  background: rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75rem;

  @media ${DeviceSize.sm} {
    width: 44px;
    padding: 0.5rem;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media ${DeviceSize.sm} {
    justify-content: center;
    gap: 0;
  }
`;

const BrandIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #B8960C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: #000;
`;

const BrandText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: white;

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 0.125rem;

  ${props => props.$active ? css`
    background: ${BRAND_COLOR}20;
    color: ${BRAND_COLOR};
  ` : css`
    color: rgba(255, 255, 255, 0.5);

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.8);
    }
  `}

  svg {
    width: 12px;
    height: 12px;
  }

  span {
    @media ${DeviceSize.sm} {
      display: none;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 1rem;
  background: #050505;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PageTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(34, 197, 94, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.625rem;
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  padding: 0.625rem;
`;

const StatLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.25rem;

  svg {
    width: 10px;
    height: 10px;
  }
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const StatChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.6rem;
  color: ${props => props.$positive ? 'rgba(255, 255, 255, 0.7)' : '#EF4444'};
`;

const TableContainer = styled.div`
  margin-top: 0.5rem;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.75fr;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.75fr;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.7rem;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }
`;

// Terminal
const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.3);
`;

const TerminalTitle = styled.span`
  margin-left: 0.5rem;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
  font-family: ui-monospace, monospace;
`;

const TerminalBody = styled.div`
  padding: 1rem;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  background: #050505;
  height: 200px;
  overflow-y: auto;
`;

const TerminalLine = styled.div<{ $type?: string }>`
  margin-bottom: 0.25rem;
  color: ${props => {
    switch (props.$type) {
      case 'command': return 'rgba(255, 255, 255, 0.8)';
      case 'success': return 'rgba(255, 255, 255, 0.7)';
      case 'info': return 'rgba(255, 255, 255, 0.5)';
      case 'highlight': return BRAND_COLOR;
      default: return 'rgba(255, 255, 255, 0.6)';
    }
  }};
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: white;
  animation: ${pulse} 1s infinite;
  vertical-align: middle;
  margin-left: 4px;
`;

// Mobile Device
const MobileDevice = styled.div`
  width: 150px;
  height: 308px;
  border-radius: 32px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  background: #0a0a0a;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Notch = styled.div`
  background: #050505;
  padding: 0.5rem 0 0.25rem;
  display: flex;
  justify-content: center;
`;

const NotchInner = styled.div`
  width: 60px;
  height: 18px;
  background: black;
  border-radius: 9999px;
`;

const MobileContent = styled.div`
  flex: 1;
  background: #050505;
  padding: 0.625rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const MobileLogo = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 0.375rem;
  background: ${BRAND_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: #000;
`;

const MobileName = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: white;
`;

const MobileBalance = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const BalanceLabel = styled.div`
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 0.125rem;
`;

const BalanceValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const MobileActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const MobileAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const ActionIcon = styled.div<{ $color?: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$color || 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 12px;
    height: 12px;
    color: ${BRAND_COLOR};
  }
`;

const ActionLabel = styled.span`
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MobileAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 0.375rem;
  padding: 0.375rem 0.5rem;
  margin-bottom: 0.25rem;
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const AssetIcon = styled.div<{ $color: string }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: bold;
  color: white;
`;

const AssetName = styled.span`
  font-size: 0.625rem;
  color: white;
`;

const AssetValue = styled.span`
  font-size: 0.625rem;
  color: white;
`;

const HomeBar = styled.div`
  background: #050505;
  padding: 0.375rem 0;
  display: flex;
  justify-content: center;
`;

const HomeBarInner = styled.div`
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
`;

const TabContent = styled.div`
  min-height: 280px;
`;

const DemoStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DemoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
`;

const MobileFloat = styled.div`
  position: absolute;
  right: -1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;

  @media ${DeviceSize.lg} {
    right: 0;
  }
`;

// Icons
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ExchangeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18M18 9l-5 5-4-4-6 6" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const ReceiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const getIcon = (name: string) => {
  switch (name) {
    case 'grid': return <GridIcon />;
    case 'wallet': return <WalletIcon />;
    case 'globe': return <GlobeIcon />;
    case 'exchange': return <ExchangeIcon />;
    case 'chart': return <ChartIcon />;
    case 'doc': return <DocIcon />;
    case 'shield': return <ShieldIcon />;
    case 'link': return <LinkIcon />;
    default: return <GridIcon />;
  }
};

// Dashboard Component
const DashboardMock = () => (
  <MockContainer>
    <BrowserChrome>
      <BrowserDots>
        <Dot $color="rgba(255, 255, 255, 0.4)" />
        <Dot $color="rgba(255, 255, 255, 0.25)" />
        <Dot $color="rgba(255, 255, 255, 0.15)" />
      </BrowserDots>
      <UrlBar>
        <UrlBox>app.lux.financial</UrlBox>
      </UrlBar>
    </BrowserChrome>
    <DashboardBody>
      <Sidebar>
        <SidebarBrand>
          <BrandIcon>L</BrandIcon>
          <BrandText>Lux</BrandText>
        </SidebarBrand>
        {DASHBOARD_NAV.map((item) => (
          <NavItem key={item.label} $active={item.active}>
            {getIcon(item.icon)}
            <span>{item.label}</span>
          </NavItem>
        ))}
      </Sidebar>
      <MainContent>
        <TopBar>
          <PageTitle>Dashboard</PageTitle>
          <StatusBadge>
            <StatusDot />
            All systems live
          </StatusBadge>
        </TopBar>
        <StatsGrid>
          <StatCard>
            <StatLabel>{getIcon('exchange')} Balance</StatLabel>
            <StatValue>$2.84M</StatValue>
            <StatChange $positive>+12.5%</StatChange>
          </StatCard>
          <StatCard>
            <StatLabel>{getIcon('globe')} Volume</StatLabel>
            <StatValue>$428K</StatValue>
            <StatChange $positive>+8.2%</StatChange>
          </StatCard>
          <StatCard>
            <StatLabel>{getIcon('wallet')} Wallets</StatLabel>
            <StatValue>1,247</StatValue>
            <StatChange $positive>+156</StatChange>
          </StatCard>
          <StatCard>
            <StatLabel>{getIcon('chart')} TXs</StatLabel>
            <StatValue>8,392</StatValue>
            <StatChange $positive>+2.1K</StatChange>
          </StatCard>
        </StatsGrid>
        <TableContainer>
          <TableHeader>
            <span>Asset</span>
            <span>Balance</span>
            <span>Chain</span>
            <span>Status</span>
          </TableHeader>
          <TableRow>
            <span>USDC</span>
            <span>$1,428,500</span>
            <span>Polygon</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Live</span>
          </TableRow>
          <TableRow>
            <span>USDT</span>
            <span>$876,293</span>
            <span>Ethereum</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Live</span>
          </TableRow>
        </TableContainer>
      </MainContent>
    </DashboardBody>
  </MockContainer>
);

// Terminal Component
const TerminalMock = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => prev < TERMINAL_LINES.length ? prev + 1 : prev);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <MockContainer>
      <TerminalHeader>
        <BrowserDots>
          <Dot $color="rgba(255, 255, 255, 0.4)" />
          <Dot $color="rgba(255, 255, 255, 0.25)" />
          <Dot $color="rgba(255, 255, 255, 0.15)" />
        </BrowserDots>
        <TerminalTitle>lux-cli — zsh</TerminalTitle>
      </TerminalHeader>
      <TerminalBody>
        {TERMINAL_LINES.slice(0, step).map((line, idx) => (
          <TerminalLine key={idx} $type={line.type}>
            {line.text}
          </TerminalLine>
        ))}
        <TerminalLine $type="command">$ <Cursor /></TerminalLine>
      </TerminalBody>
    </MockContainer>
  );
};

// Mobile Component
const MobileDeviceMock = () => (
  <MobileDevice>
    <Notch>
      <NotchInner />
    </Notch>
    <MobileContent>
      <MobileHeader>
        <MobileBrand>
          <MobileLogo>L</MobileLogo>
          <MobileName>Lux</MobileName>
        </MobileBrand>
        <BellIcon />
      </MobileHeader>
      <MobileBalance>
        <BalanceLabel>Total Balance</BalanceLabel>
        <BalanceValue>$24,850</BalanceValue>
      </MobileBalance>
      <MobileActions>
        <MobileAction>
          <ActionIcon>
            <SendIcon />
          </ActionIcon>
          <ActionLabel>Send</ActionLabel>
        </MobileAction>
        <MobileAction>
          <ActionIcon $color="rgba(59, 130, 246, 0.15)">
            <ReceiveIcon />
          </ActionIcon>
          <ActionLabel>Receive</ActionLabel>
        </MobileAction>
      </MobileActions>
      <MobileAsset>
        <AssetInfo>
          <AssetIcon $color="#2775CA">$</AssetIcon>
          <AssetName>USDC</AssetName>
        </AssetInfo>
        <AssetValue>$15,000</AssetValue>
      </MobileAsset>
      <MobileAsset>
        <AssetInfo>
          <AssetIcon $color="#26A17B">₮</AssetIcon>
          <AssetName>USDT</AssetName>
        </AssetInfo>
        <AssetValue>$8,500</AssetValue>
      </MobileAsset>
      <MobileAsset>
        <AssetInfo>
          <AssetIcon $color="#F7931A">₿</AssetIcon>
          <AssetName>BTC</AssetName>
        </AssetInfo>
        <AssetValue>$1,350</AssetValue>
      </MobileAsset>
    </MobileContent>
    <HomeBar>
      <HomeBarInner />
    </HomeBar>
  </MobileDevice>
);

// Main Component
export default function HeroSection() {
  const [mobileTab, setMobileTab] = useState<MobileTab>("dashboard");

  return (
    <HeroContainer>
      <HeroCard>
        <BackgroundGlow>
          <GlowOrb $opacity={0.12} />
          <GlowOrb $color="#fff" $size="400px" $position="bottom: -200px; left: -100px;" $opacity={0.03} />
        </BackgroundGlow>
        <GridPattern />

        <Content>
          {/* Desktop Layout */}
          <DesktopGrid>
            <LeftColumn>
              <CopySection>
                <Badge>Complete financial infrastructure</Badge>
                <Headline>
                  <HeadlineWhite>The complete</HeadlineWhite>
                  <br />
                  <HeadlineGold>financial platform.</HeadlineGold>
                </Headline>
                <Subhead>
                  Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM.
                  200+ countries. All in one platform with post-quantum security.
                </Subhead>
                <ButtonRow>
                  <PrimaryButton href="https://cal.com/luxfi" target="_blank">
                    Talk to Sales <ArrowIcon />
                  </PrimaryButton>
                  <SecondaryBtn href="https://docs.lux.financial" target="_blank">
                    Documentation <ExternalIcon />
                  </SecondaryBtn>
                </ButtonRow>
                <ChipsRow>
                  {PROOF_CHIPS.map((chip) => (
                    <Chip key={chip.label}>
                      {getIcon(chip.icon)}
                      {chip.label}
                    </Chip>
                  ))}
                </ChipsRow>
              </CopySection>
            </LeftColumn>

            <RightColumn>
              <DashboardMock />
              <div style={{ marginTop: '1rem', maxWidth: '400px' }}>
                <TerminalMock />
              </div>
              <MobileFloat>
                <MobileDeviceMock />
              </MobileFloat>
            </RightColumn>
          </DesktopGrid>

          {/* Tablet Layout */}
          <TabletLayout>
            <CopySection $center>
              <Badge>Complete financial infrastructure</Badge>
              <Headline>
                <HeadlineWhite>The complete</HeadlineWhite>
                <br />
                <HeadlineGold>financial platform.</HeadlineGold>
              </Headline>
              <Subhead>
                Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM.
                200+ countries.
              </Subhead>
              <ButtonRow style={{ justifyContent: 'center' }}>
                <PrimaryButton href="https://cal.com/luxfi" target="_blank">
                  Talk to Sales <ArrowIcon />
                </PrimaryButton>
                <SecondaryBtn href="https://docs.lux.financial" target="_blank">
                  Documentation <ExternalIcon />
                </SecondaryBtn>
              </ButtonRow>
              <ChipsRow $center>
                {PROOF_CHIPS.slice(0, 4).map((chip) => (
                  <Chip key={chip.label}>
                    {getIcon(chip.icon)}
                    {chip.label}
                  </Chip>
                ))}
              </ChipsRow>
            </CopySection>
            <DemoStack>
              <DashboardMock />
              <DemoRow>
                <TerminalMock />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <MobileDeviceMock />
                </div>
              </DemoRow>
            </DemoStack>
          </TabletLayout>

          {/* Mobile Layout */}
          <MobileLayout>
            <CopySection $center>
              <Badge>Complete financial infrastructure</Badge>
              <Headline>
                <HeadlineWhite>The complete</HeadlineWhite>
                <br />
                <HeadlineGold>financial platform.</HeadlineGold>
              </Headline>
              <Subhead>
                Fiat, crypto, stablecoins, digital securities. 200+ countries.
              </Subhead>
              <ButtonRow>
                <PrimaryButton href="https://cal.com/luxfi" target="_blank">
                  Talk to Sales <ArrowIcon />
                </PrimaryButton>
                <SecondaryBtn href="https://docs.lux.financial" target="_blank">
                  Docs <ExternalIcon />
                </SecondaryBtn>
              </ButtonRow>
              <ChipsRow $center>
                {PROOF_CHIPS.slice(0, 4).map((chip) => (
                  <Chip key={chip.label}>
                    {getIcon(chip.icon)}
                    {chip.label}
                  </Chip>
                ))}
              </ChipsRow>
            </CopySection>

            <TabSelector>
              {(["dashboard", "terminal", "mobile"] as MobileTab[]).map((tab) => (
                <TabButton
                  key={tab}
                  $active={mobileTab === tab}
                  onClick={() => setMobileTab(tab)}
                >
                  {tab}
                </TabButton>
              ))}
            </TabSelector>

            <TabContent>
              {mobileTab === "dashboard" && <DashboardMock />}
              {mobileTab === "terminal" && <TerminalMock />}
              {mobileTab === "mobile" && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <MobileDeviceMock />
                </div>
              )}
            </TabContent>
          </MobileLayout>
        </Content>
      </HeroCard>
    </HeroContainer>
  );
}

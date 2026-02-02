"use client";
import styled, { keyframes } from "styled-components";

import { DeviceSize } from "@/styles/theme/default";

// Subtle fade in animation
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// Main content wrapper with max-width
export const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px; /* Header offset */

  @media ${DeviceSize.md} {
    padding: 0 1.5rem;
    padding-top: 56px;
  }

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    padding-top: 56px;
  }
`;

// Hero Section - Full width container with gradient
export const HeroSection = styled.section`
  position: relative;
  padding: 4rem 0 6rem;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 4rem;
  background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 255, 255, 0.04), transparent);

  @media ${DeviceSize.lg} {
    padding: 3rem 0 5rem;
    gap: 3rem;
  }

  @media ${DeviceSize.md} {
    padding: 2rem 0 4rem;
    min-height: auto;
    gap: 2.5rem;
  }

  @media ${DeviceSize.sm} {
    padding: 1.5rem 0 3rem;
    gap: 2rem;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeUp} 0.6s ease forwards;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;

  @media ${DeviceSize.sm} {
    gap: 1rem;
  }
`;

// Platform Showcase Container
export const PlatformShowcase = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 2rem;
  animation: ${fadeUp} 0.6s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
  align-items: start;

  @media ${DeviceSize.lg} {
    grid-template-columns: 1fr 180px;
    gap: 1.5rem;
  }

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const PlatformLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media ${DeviceSize.sm} {
    gap: 1rem;
  }
`;

export const PlatformRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 1rem;

  @media ${DeviceSize.md} {
    flex-direction: row;
    justify-content: center;
    padding-top: 0;
  }

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

// Dashboard Mockup
export const DashboardMock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  };
`;

export const DashboardBrowser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const BrowserDots = styled.div`
  display: flex;
  gap: 6px;
`;

export const BrowserDot = styled.div<{ $color?: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme, $color }) => $color || theme.colors.border};
`;

export const BrowserUrl = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const BrowserUrlBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: 6px;
  padding: 0.35rem 1rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
  font-family: ui-monospace, monospace;
`;

export const DashboardBody = styled.div`
  display: flex;
  min-height: 320px;

  @media ${DeviceSize.sm} {
    min-height: 280px;
  }
`;

export const DashboardSidebar = styled.div`
  width: 180px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem;

  @media ${DeviceSize.sm} {
    width: 50px;
    padding: 0.5rem;
  }
`;

export const DashboardBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    justify-content: center;
    gap: 0;
  }
`;

export const DashboardBrandIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #FFFFFF 0%, #B8960C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: #000;
`;

export const DashboardBrandText = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};

  @media ${DeviceSize.sm} {
    display: none;
  }
`;

export const DashboardNavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 1.2rem;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.secondary};
  background: ${({ theme, $active }) => $active ? theme.colors.surfaceHover : 'transparent'};
  margin-bottom: 0.25rem;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  @media ${DeviceSize.sm} {
    justify-content: center;
    padding: 0.5rem;
    gap: 0;

    span { display: none; }
  }
`;

export const DashboardMain = styled.div`
  flex: 1;
  padding: 1.25rem;
  background: ${({ theme }) => theme.colors.background};
`;

export const DashboardTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

export const DashboardPageTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const DashboardStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const StatusDot = styled.div<{ $color?: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $color }) => $color || theme.colors.secondary};
`;

export const DashboardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const DashboardStat = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0.75rem;
`;

export const DashboardStatLabel = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const DashboardStatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const DashboardStatChange = styled.div<{ $positive?: boolean }>`
  font-size: 0.95rem;
  color: ${({ theme, $positive }) => $positive ? theme.colors.secondary : theme.colors.muted};
`;

export const DashboardTable = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
`;

export const DashboardTableRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 0.8fr;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  font-size: 1.05rem;
  color: ${({ theme, $header }) => $header ? theme.colors.muted : theme.colors.secondary};
  background: ${({ theme, $header }) => $header ? theme.colors.surface : 'transparent'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr 1fr;

    span:nth-child(3), span:nth-child(4) {
      display: none;
    }
  }
`;

// Terminal Mockup
export const TerminalMock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  };
  flex: 1;

  @media ${DeviceSize.md} {
    flex: none;
  }
`;

export const TerminalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const TerminalTitle = styled.span`
  margin-left: 0.5rem;
  font-size: 1rem;
  font-family: ui-monospace, monospace;
  color: ${({ theme }) => theme.colors.muted};
`;

export const TerminalBody = styled.div`
  padding: 1rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 1.1rem;
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.background};
  min-height: 180px;
  max-height: 220px;
  overflow-y: auto;
`;

export const TerminalLine = styled.div<{ $type?: 'command' | 'success' | 'info' | 'highlight' }>`
  color: ${({ theme, $type }) => {
    switch($type) {
      case 'success': return theme.colors.secondary;
      case 'highlight': return theme.colors.primary;
      case 'info': return theme.colors.muted;
      default: return theme.colors.secondary;
    }
  }};
  margin-bottom: 0.25rem;
`;

export const TerminalCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background: ${({ theme }) => theme.colors.primary};
  margin-left: 4px;
  animation: ${pulse} 1s infinite;
`;

// Mobile Device Mockup
export const MobileDeviceMock = styled.div`
  width: 160px;
  background: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "linear-gradient(180deg, #e5e5e5 0%, #f5f5f5 100%)"
      : "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)"
  };
  border-radius: 32px;
  padding: 8px;
  box-shadow: ${({ theme }) =>
    theme.colors.background === "#FFFFFF"
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  };
  flex-shrink: 0;
  align-self: center;

  @media ${DeviceSize.md} {
    width: 140px;
  }

  @media ${DeviceSize.sm} {
    width: 160px;
    margin: 0 auto;
  }
`;

export const MobileDeviceScreen = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 26px;
  overflow: hidden;
  aspect-ratio: 9 / 19.5;
`;

export const MobileDeviceNotch = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding-top: 0.5rem;
  display: flex;
  justify-content: center;
`;

export const MobileDeviceNotchInner = styled.div`
  width: 60px;
  height: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 0 0 12px 12px;
`;

export const MobileDeviceContent = styled.div`
  padding: 0.75rem;
`;

export const MobileDeviceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const MobileDeviceBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MobileDeviceLogo = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background: linear-gradient(135deg, #FFFFFF 0%, #B8960C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #000;
`;

export const MobileDeviceName = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MobileDeviceBalance = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const MobileDeviceBalanceLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const MobileDeviceBalanceValue = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MobileDeviceActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
`;

export const MobileDeviceAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const MobileDeviceActionIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$color || 'rgba(34, 197, 94, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const MobileDeviceActionLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const MobileDeviceAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  margin-bottom: 0.4rem;
`;

export const MobileDeviceAssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

export const MobileDeviceAssetIcon = styled.div<{ $color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
`;

export const MobileDeviceAssetName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MobileDeviceAssetValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const MobileDeviceHomeBar = styled.div`
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
`;

export const MobileDeviceHomeBarInner = styled.div`
  width: 40px;
  height: 4px;
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 2px;
`;

export const HeroTitle = styled.h1`
  font-size: 5.2rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  @media ${DeviceSize.md} {
    font-size: 4rem;
  }

  @media ${DeviceSize.sm} {
    font-size: 3.2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 480px;

  @media ${DeviceSize.sm} {
    font-size: 1.6rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;

    button, a {
      width: 100%;
    }
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
`;

// Product Mock Container
export const HeroMock = styled.div`
  position: relative;
  animation: ${fadeUp} 0.6s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;

  @media ${DeviceSize.md} {
    order: -1;
  }
`;

export const MockFrame = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  overflow: hidden;
`;

export const MockScreen = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  min-height: 320px;
`;

export const MockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const MockDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.muted};
`;

export const MockMetric = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const MockLabel = styled.span`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const MockValue = styled.span`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

// Feature Grid
export const FeatureSection = styled.section`
  padding: 6rem 0;

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const SectionTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.6rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-2px);
  }
`;

export const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 1rem;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const FeatureDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

export const FeatureLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// Developer Section
export const DeveloperSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 6rem 0;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const DeveloperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DeveloperTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.6rem;
  }
`;

export const DeveloperText = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const CodeBlock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const CodeHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceHover};
`;

export const CodeTab = styled.button<{ $active?: boolean }>`
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $active }) => $active ? theme.colors.surfaceHover : 'transparent'};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const CodeContent = styled.pre`
  padding: 1.5rem;
  margin: 0;
  font-size: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1.7;
  overflow-x: auto;

  .keyword { color: #C792EA; }
  .string { color: #C3E88D; }
  .property { color: #82AAFF; }
  .comment { color: ${({ theme }) => theme.colors.muted}; }
`;

// Security Section
export const SecuritySection = styled.section`
  padding: 6rem 0;

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const SecurityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const SecurityIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: #3CE38A;
  flex-shrink: 0;
  margin-top: 0.2rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const SecurityText = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
`;

// Final CTA
export const CTASection = styled.section`
  text-align: center;
  padding: 8rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 5rem 0;
  }
`;

export const CTATitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.6rem;
  }
`;

export const CTASubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

// Infrastructure Section
export const InfraSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, transparent 100%);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const InfraGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const InfraCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-2px);
  }
`;

export const InfraIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
  color: #22D3EE;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const InfraTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const InfraDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.4;
`;

// Demo Showcase Section
export const DemoSection = styled.section`
  padding: 6rem 0;

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const DemoContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  min-height: 500px;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const DemoSidebar = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1.5rem;

  @media ${DeviceSize.md} {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
`;

export const DemoLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

export const TriangleLogo = styled.div`
  width: 32px;
  height: 32px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const DemoLogoText = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

export const DemoNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DemoNavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1.3rem;
  color: ${props => props.$active ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.5)'};
  background: ${props => props.$active ? 'rgba(139, 92, 246, 0.15)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
`;

export const DemoContent = styled.div`
  padding: 2rem;
  background: #0B0F14;
`;

export const DemoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const DemoTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

export const DemoCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const DemoCard = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1.25rem;
`;

export const DemoCardLabel = styled.span`
  display: block;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 0.5rem;
`;

export const DemoCardValue = styled.span<{ $color?: string }>`
  display: block;
  font-size: 1.8rem;
  font-weight: 600;
  color: ${props => props.$color || 'rgba(255, 255, 255, 0.92)'};
`;

export const DemoTable = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
`;

export const DemoTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 1fr 1.5fr 1.5fr 0.8fr;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media ${DeviceSize.md} {
    display: none;
  }
`;

export const DemoTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr 1fr 1.5fr 1.5fr 0.8fr;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

export const StatusBadge = styled.span<{ $status: 'completed' | 'pending' | 'processing' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 4px;
  background: ${props => {
    switch(props.$status) {
      case 'completed': return 'rgba(34, 197, 94, 0.15)';
      case 'pending': return 'rgba(245, 158, 11, 0.15)';
      case 'processing': return 'rgba(59, 130, 246, 0.15)';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'completed': return 'rgba(255, 255, 255, 0.7)';
      case 'pending': return '#FFFFFF';
      case 'processing': return '#3B82F6';
    }
  }};

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const CryptoIcon = styled.span<{ $type: 'usdc' | 'usdt' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 0.5rem;
  background: ${props => props.$type === 'usdc' ? '#2775CA' : '#26A17B'};
  color: white;
`;

// Mobile App Section
export const MobileSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.03) 0%, transparent 100%);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const MobileContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const MobileText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const MobileBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const MobileTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.6rem;
  }
`;

export const MobileDescription = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MobileFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

export const MobileFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const MobileButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;

  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

export const AppStoreBadge = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const AppStoreText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AppStoreLabel = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.muted};
`;

export const AppStoreName = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`;

export const MobilePhones = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1.5rem;
  perspective: 1000px;

  @media ${DeviceSize.md} {
    order: -1;
  }

  @media ${DeviceSize.sm} {
    gap: 0.75rem;
  }
`;

export const PhoneMockup = styled.div<{ $position?: string }>`
  width: 180px;
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 28px;
  padding: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: ${props => {
    if (props.$position === 'left') return 'perspective(1000px) rotateY(15deg) scale(0.85)';
    if (props.$position === 'right') return 'perspective(1000px) rotateY(-15deg) scale(0.85)';
    return 'scale(1)';
  }};
  z-index: ${props => props.$position ? 1 : 2};
  transition: transform 0.3s ease;

  @media ${DeviceSize.sm} {
    width: 140px;
    border-radius: 22px;
    padding: 6px;
    display: ${props => props.$position ? 'none' : 'block'};
  }
`;

export const PhoneScreen = styled.div`
  background: #000;
  border-radius: 22px;
  overflow: hidden;
  aspect-ratio: 9/19.5;

  @media ${DeviceSize.sm} {
    border-radius: 18px;
  }
`;

export const PhoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0.5rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const PhoneNotch = styled.div`
  width: 80px;
  height: 24px;
  background: #1a1a1a;
  border-radius: 0 0 12px 12px;
  margin: 0 auto;
`;

export const PhoneContent = styled.div`
  padding: 1rem;
`;

export const PhoneBalance = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const PhoneBalanceLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.25rem;
`;

export const PhoneBalanceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

export const PhoneActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

export const PhoneAction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const PhoneActionIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.$color || 'rgba(34, 197, 94, 0.15)'};
  color: ${props => props.$color ? 'white' : 'rgba(255, 255, 255, 0.7)'};

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const PhoneActionLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
`;

export const PhoneAssets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PhoneAsset = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

export const PhoneAssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const PhoneAssetIcon = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.$color};
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
`;

export const PhoneAssetName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

export const PhoneAssetValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

// Stats Section
export const StatsSection = styled.section`
  padding: 4rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 3.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.8rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0.5rem;
`;

// Industries Section
export const IndustriesSection = styled.section`
  padding: 6rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const IndustriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-top: 3rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
`;

export const IndustryCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-2px);
  }
`;

export const IndustryIcon = styled.span`
  font-size: 2rem;
`;

export const IndustryName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  line-height: 1.3;

  @media ${DeviceSize.sm} {
    font-size: 1rem;
  }
`;

export const ViewAllLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: #FFFFFF;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

// Compliance Section
export const ComplianceSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 100%);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const ComplianceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 3rem;

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const ComplianceCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

export const ComplianceTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const ComplianceDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.secondary};
`;

// Legacy exports for compatibility
export const Card = styled.div``;
export const ImgContainer = styled.div``;
export const TextContainer = styled.div<{ $mobile?: boolean }>``;

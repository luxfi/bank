"use client";
import styled, { keyframes } from "styled-components";
import { DeviceSize } from "@/styles/theme/default";

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

export const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    padding-top: 56px;
  }
`;

export const HeroSection = styled.section`
  padding: 6rem 0;
  text-align: center;

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeUp} 0.6s ease forwards;
`;

export const ProductBadge = styled.span<{ $color?: string }>`
  display: inline-block;
  align-self: flex-start;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme, $color }) => $color || theme.colors.secondary};
  background: ${({ theme, $color }) => $color ? `${$color}15` : theme.colors.surface};
  border: 1px solid ${({ theme, $color }) => $color ? `${$color}30` : theme.colors.border};
  border-radius: 20px;
`;

export const HeroTitle = styled.h1`
  font-size: 4.4rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.md} {
    font-size: 3.6rem;
  }

  @media ${DeviceSize.sm} {
    font-size: 3rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;

  @media ${DeviceSize.sm} {
    font-size: 1.6rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media ${DeviceSize.sm} {
    flex-direction: column;
  }
`;

// Two Column Layout
export const TwoColumnSection = styled.section<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 6rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.md} {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

export const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const BlockTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.4rem;
  }
`;

export const BlockText = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
`;

// Feature List
export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const FeatureCheck = styled.div<{ $color?: string }>`
  width: 1.5rem;
  height: 1.5rem;
  color: ${props => props.$color || '#3CE38A'};
  flex-shrink: 0;
  margin-top: 0.1rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const FeatureText = styled.span`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 1.4;
`;

// Visual Block (for diagrams/mockups)
export const VisualBlock = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2rem;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Grid Section
export const Section = styled.section`
  padding: 6rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media ${DeviceSize.sm} {
    padding: 4rem 0;
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 2.4rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

// Cards Grid
export const CardGrid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols || 3}, 1fr);
  gap: 1.5rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ $accent?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme, $accent }) => $accent ? `${$accent}50` : theme.colors.borderHover};
    transform: translateY(-2px);
  }
`;

export const CardIcon = styled.div<{ $color?: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: ${({ theme, $color }) => $color ? `${$color}15` : theme.colors.surface};
  border: 1px solid ${({ theme, $color }) => $color ? `${$color}30` : theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, $color }) => $color || theme.colors.secondary};
  margin-bottom: 1.25rem;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const CardDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

// Code Block
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
  background: ${({ theme }) => theme.colors.surface};
`;

export const CodeTab = styled.span<{ $active?: boolean }>`
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-family: ui-monospace, monospace;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.muted};
  background: ${({ theme, $active }) => $active ? theme.colors.surfaceHover : 'transparent'};
  border-radius: 6px;
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
  .number { color: #F78C6C; }
`;

// Stats Row
export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 4rem 0;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme, $color }) => $color || theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.muted};
`;

// CTA Section
export const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

export const CTASubtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

// Architecture Diagram
export const DiagramContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const DiagramRow = styled.div<{ $center?: boolean }>`
  display: flex;
  justify-content: ${props => props.$center ? 'center' : 'space-between'};
  gap: 1rem;
  flex-wrap: wrap;

  @media ${DeviceSize.sm} {
    flex-direction: column;
    align-items: center;
  }
`;

export const DiagramNode = styled.div<{ $type?: 'primary' | 'secondary' | 'highlight' }>`
  padding: 0.75rem 1.25rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  text-align: center;
  min-width: 120px;

  ${({ theme, $type }) => {
    switch ($type) {
      case 'primary':
        return `
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
          border: 1px solid rgba(139, 92, 246, 0.4);
          color: #22D3EE;
        `;
      case 'highlight':
        return `
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #22C55E;
        `;
      default:
        return `
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          color: ${theme.colors.secondary};
        `;
    }
  }}
`;

export const DiagramArrow = styled.div`
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.5rem;
`;

// Technical Specs Table
export const SpecsTable = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const SpecsRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $header }) => $header ? theme.colors.surface : 'transparent'};

  &:last-child {
    border-bottom: none;
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

export const SpecsLabel = styled.span<{ $header?: boolean }>`
  font-size: ${({ $header }) => $header ? '1.2rem' : '1.3rem'};
  font-weight: ${({ $header }) => $header ? '600' : '500'};
  color: ${({ theme, $header }) => $header ? theme.colors.muted : theme.colors.secondary};
`;

export const SpecsValue = styled.span`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.primary};
`;

"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import {
  PageContainer,
  HeroSection,
  HeroContent,
  ProductBadge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  TwoColumnSection,
  ContentBlock,
  BlockTitle,
  BlockText,
  FeatureList,
  FeatureItem,
  FeatureCheck,
  FeatureText,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  CardGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
} from "../styles";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExchangeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const features = [
  {
    icon: ExchangeIcon,
    title: "Multi-Asset Trading",
    description: "Stocks, crypto, forex, commodities, options, and futures. 10,000+ equities, 200+ crypto assets, 50+ FX pairs from one platform.",
    color: "#8B5CF6",
  },
  {
    icon: LayersIcon,
    title: "White-Label Exchange",
    description: "Launch your branded CEX with institutional matching engine. DEX aggregation across 100+ venues with MEV protection.",
    color: "#22C55E",
  },
  {
    icon: ChartIcon,
    title: "Real-Time Market Data",
    description: "TradingView integration with advanced charting, technical indicators, and professional analytics tools.",
    color: "#3B82F6",
  },
  {
    icon: ShieldIcon,
    title: "SEC & FINRA Regulated",
    description: "Full regulatory compliance. SIPC protected. AML/KYC, transaction monitoring, and reporting built in.",
    color: "#FFFFFF",
  },
];

// TradingView Ticker Tape Component
function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:GOOGL", title: "Google" },
        { proName: "NASDAQ:MSFT", title: "Microsoft" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "COMEX:GC1!", title: "Gold" },
        { proName: "NASDAQ:NVDA", title: "NVIDIA" },
        { proName: "NYSE:JPM", title: "JPMorgan" },
        { proName: "BINANCE:SOLUSDT", title: "Solana" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <TickerContainer>
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </TickerContainer>
  );
}

// TradingView Advanced Chart Component
function AdvancedChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "NASDAQ:AAPL",
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <ChartContainer>
      <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }}></div>
      </div>
    </ChartContainer>
  );
}

// TradingView Market Overview Component
function MarketOverview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      symbolsGroups: [
        {
          name: "Equities",
          symbols: [
            { name: "NASDAQ:AAPL", displayName: "Apple" },
            { name: "NASDAQ:GOOGL", displayName: "Google" },
            { name: "NASDAQ:MSFT", displayName: "Microsoft" },
            { name: "NASDAQ:NVDA", displayName: "NVIDIA" },
            { name: "NYSE:JPM", displayName: "JPMorgan" },
          ]
        },
        {
          name: "Crypto",
          symbols: [
            { name: "BITSTAMP:BTCUSD", displayName: "Bitcoin" },
            { name: "BITSTAMP:ETHUSD", displayName: "Ethereum" },
            { name: "BINANCE:SOLUSDT", displayName: "Solana" },
            { name: "BINANCE:AVAXUSDT", displayName: "Avalanche" },
          ]
        },
        {
          name: "Forex",
          symbols: [
            { name: "FX:EURUSD", displayName: "EUR/USD" },
            { name: "FX:GBPUSD", displayName: "GBP/USD" },
            { name: "FX:USDJPY", displayName: "USD/JPY" },
          ]
        },
        {
          name: "Commodities",
          symbols: [
            { name: "COMEX:GC1!", displayName: "Gold" },
            { name: "NYMEX:CL1!", displayName: "Crude Oil" },
            { name: "COMEX:SI1!", displayName: "Silver" },
          ]
        },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      isTransparent: false,
      backgroundColor: "#0a0a0a",
      locale: "en",
    });
    containerRef.current.appendChild(script);
  }, []);

  return (
    <MarketContainer>
      <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </MarketContainer>
  );
}

// Cal.com Embed Component
function CalEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.Cal) {
        // @ts-ignore
        window.Cal("init", { origin: "https://cal.com" });
        // @ts-ignore
        window.Cal("inline", {
          elementOrSelector: "#cal-embed",
          calLink: "luxfi",
          layout: "month_view",
        });
        // @ts-ignore
        window.Cal("ui", {
          theme: "dark",
          styles: { branding: { brandColor: "#FFFFFF" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <CalContainer id="cal-embed" />
  );
}

export default function Exchange() {
  return (
    <PageContainer>
      {/* Ticker Tape */}
      <TickerTape />

      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#8B5CF6">Multi-Asset Exchange</ProductBadge>
          <HeroTitle>
            Trade everything
          </HeroTitle>
          <HeroSubtitle>
            Stocks, crypto, forex, commodities—all markets, one platform.
            White-label exchange infrastructure with SEC/FINRA compliance.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="#book-demo">
              <CustomButton>Book a Demo</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/exchange" target="_blank">
              <SecondaryButton>View API Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <StatValue $color="#8B5CF6">10,000+</StatValue>
          <StatLabel>Equities</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>200+</StatValue>
          <StatLabel>Crypto Assets</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>50+</StatValue>
          <StatLabel>FX Pairs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{"<"}10ms</StatValue>
          <StatLabel>Latency</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Live Chart Demo */}
      <Section>
        <SectionHeader>
          <SectionTitle>Live Market Data</SectionTitle>
          <SectionSubtitle>
            Real-time charting powered by TradingView
          </SectionSubtitle>
        </SectionHeader>
        <AdvancedChart />
      </Section>

      {/* Market Overview */}
      <Section>
        <SectionHeader>
          <SectionTitle>Multi-Asset Markets</SectionTitle>
          <SectionSubtitle>
            Equities, crypto, forex, and commodities in one view
          </SectionSubtitle>
        </SectionHeader>
        <MarketOverview />
      </Section>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>Complete Platform</SectionTitle>
          <SectionSubtitle>
            Everything you need to run a professional exchange
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={2}>
          {features.map((feature, index) => (
            <Card key={index} $accent={feature.color}>
              <CardIcon $color={feature.color}>
                <feature.icon />
              </CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* CEX Features */}
      <TwoColumnSection>
        <ContentBlock>
          <ProductBadge $color="#8B5CF6">Centralized Exchange</ProductBadge>
          <BlockTitle>Institutional-Grade CEX</BlockTitle>
          <BlockText>
            Launch a fully branded centralized exchange with our battle-tested
            matching engine. Sub-millisecond execution, deep order books, and
            institutional liquidity from day one.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>High-frequency matching engine ({"<"}10ms)</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Full order book with market depth</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Spot, margin, and futures trading</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>FIX API for institutional clients</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <ContentBlock>
          <ProductBadge $color="#22C55E">DEX Aggregation</ProductBadge>
          <BlockTitle>Best Execution Across All DEXs</BlockTitle>
          <BlockText>
            Connect to 100+ decentralized exchanges across Ethereum, Polygon,
            Arbitrum, and more. Smart order routing finds the best price
            with MEV protection built in.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>100+ DEXs across all major chains</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Smart order routing for best execution</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>MEV protection via private mempool</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Gas optimization and batching</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      {/* Book Demo - Embedded Cal.com */}
      <BookDemoSection id="book-demo">
        <SectionHeader>
          <SectionTitle>Book a Demo</SectionTitle>
          <SectionSubtitle>
            Schedule a call to see the platform in action
          </SectionSubtitle>
        </SectionHeader>
        <CalEmbed />
      </BookDemoSection>
    </PageContainer>
  );
}

// Styled Components
const TickerContainer = styled.div`
  width: 100%;
  height: 46px;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a0a0a;
`;

const MarketContainer = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a0a0a;
`;

const BookDemoSection = styled.section`
  padding: 4rem 0;
  scroll-margin-top: 100px;
`;

const CalContainer = styled.div`
  width: 100%;
  height: 700px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0a0a0a;
`;

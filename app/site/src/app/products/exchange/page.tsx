"use client";
import Link from "next/link";
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
  CodeBlock,
  CodeHeader,
  CodeTab,
  CodeContent,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  DiagramContainer,
  DiagramRow,
  DiagramNode,
  DiagramArrow,
  CTASection,
  CTATitle,
  CTASubtitle,
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

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const features = [
  {
    icon: ExchangeIcon,
    title: "White-Label CEX",
    description: "Launch your own branded centralized exchange with institutional matching engine, order books, and liquidity.",
    color: "#8B5CF6",
  },
  {
    icon: LayersIcon,
    title: "DEX Aggregation",
    description: "Connect to 100+ DEXs across all major chains. Best execution routing with MEV protection.",
    color: "#22C55E",
  },
  {
    icon: ChartIcon,
    title: "Institutional Liquidity",
    description: "Access deep liquidity from top market makers. Tight spreads on 500+ trading pairs.",
    color: "#3B82F6",
  },
  {
    icon: ShieldIcon,
    title: "Compliance Built-In",
    description: "AML/KYC, transaction monitoring, and regulatory reporting. Licensed in 50+ jurisdictions.",
    color: "#F59E0B",
  },
];

const tradingPairs = [
  { pair: "BTC/USD", volume: "$2.1B", spread: "0.01%" },
  { pair: "ETH/USD", volume: "$1.8B", spread: "0.02%" },
  { pair: "BTC/EUR", volume: "$890M", spread: "0.02%" },
  { pair: "ETH/BTC", volume: "$650M", spread: "0.01%" },
  { pair: "SOL/USD", volume: "$420M", spread: "0.03%" },
  { pair: "USDC/EUR", volume: "$380M", spread: "0.005%" },
];

export default function Exchange() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#8B5CF6">CEX & DEX</ProductBadge>
          <HeroTitle>
            Launch your exchange
          </HeroTitle>
          <HeroSubtitle>
            White-label CEX with institutional liquidity. DEX aggregation across
            100+ venues. Everything to build a world-class trading platform.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
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
          <StatValue $color="#8B5CF6">500+</StatValue>
          <StatLabel>Trading Pairs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>100+</StatValue>
          <StatLabel>DEX Venues</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{"<"}10ms</StatValue>
          <StatLabel>Latency</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>$50B+</StatValue>
          <StatLabel>Daily Volume</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Architecture */}
      <Section>
        <SectionHeader>
          <SectionTitle>Exchange Architecture</SectionTitle>
          <SectionSubtitle>
            Unified trading infrastructure for CEX and DEX
          </SectionSubtitle>
        </SectionHeader>

        <DiagramContainer>
          <DiagramRow>
            <DiagramNode>Your Users</DiagramNode>
            <DiagramNode>Institutions</DiagramNode>
            <DiagramNode>API Traders</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Your Branded Exchange</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="secondary">Lux Matching Engine</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">CEX Liquidity</DiagramNode>
            <DiagramNode $type="highlight">DEX Aggregation</DiagramNode>
            <DiagramNode $type="highlight">Market Makers</DiagramNode>
            <DiagramNode $type="highlight">OTC Desk</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
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

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>create-order.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">const</span> order = <span class="keyword">await</span> lux.exchange.<span class="property">createOrder</span>({
  <span class="property">symbol</span>: <span class="string">"BTC/USD"</span>,
  <span class="property">side</span>: <span class="string">"buy"</span>,
  <span class="property">type</span>: <span class="string">"limit"</span>,
  <span class="property">quantity</span>: <span class="string">"1.5"</span>,
  <span class="property">price</span>: <span class="string">"42500.00"</span>,
});

console.<span class="property">log</span>(order);
<span class="comment">// {</span>
<span class="comment">//   id: "ord_abc123",</span>
<span class="comment">//   status: "open",</span>
<span class="comment">//   filled: "0.00",</span>
<span class="comment">//   remaining: "1.5",</span>
<span class="comment">//   avgPrice: null</span>
<span class="comment">// }</span>

<span class="comment">// Subscribe to order updates</span>
lux.exchange.<span class="property">onOrderUpdate</span>((update) => {
  console.<span class="property">log</span>(<span class="string">\`Order \${update.id}: \${update.status}\`</span>);
});`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* DEX Aggregation */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>dex-swap.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// Get best route across 100+ DEXs</span>
<span class="keyword">const</span> quote = <span class="keyword">await</span> lux.dex.<span class="property">getQuote</span>({
  <span class="property">fromToken</span>: <span class="string">"ETH"</span>,
  <span class="property">toToken</span>: <span class="string">"USDC"</span>,
  <span class="property">amount</span>: <span class="string">"10.0"</span>,
  <span class="property">slippage</span>: <span class="string">"0.5"</span>, <span class="comment">// 0.5%</span>
});

console.<span class="property">log</span>(quote);
<span class="comment">// {</span>
<span class="comment">//   route: ["Uniswap V3", "Curve"],</span>
<span class="comment">//   expectedOutput: "25420.50",</span>
<span class="comment">//   priceImpact: "0.02%",</span>
<span class="comment">//   gasEstimate: "0.005 ETH"</span>
<span class="comment">// }</span>

<span class="comment">// Execute with MEV protection</span>
<span class="keyword">const</span> swap = <span class="keyword">await</span> lux.dex.<span class="property">executeSwap</span>(quote, {
  <span class="property">mevProtection</span>: <span class="keyword">true</span>,
  <span class="property">deadline</span>: <span class="number">300</span>, <span class="comment">// 5 minutes</span>
});`}</CodeContent>
        </CodeBlock>

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

      {/* Liquidity */}
      <Section>
        <SectionHeader>
          <SectionTitle>Deep Liquidity</SectionTitle>
          <SectionSubtitle>
            Top trading pairs with institutional market makers
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          {tradingPairs.map((pair, index) => (
            <Card key={index}>
              <CardTitle>{pair.pair}</CardTitle>
              <CardDescription>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>24h Volume:</strong> {pair.volume}
                </div>
                <div>
                  <strong>Spread:</strong>{" "}
                  <span style={{ color: '#22C55E' }}>{pair.spread}</span>
                </div>
              </CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to launch your exchange?</CTATitle>
        <CTASubtitle>
          Get started with our white-label exchange platform.
        </CTASubtitle>
        <Link href="/contact">
          <CustomButton>Contact Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

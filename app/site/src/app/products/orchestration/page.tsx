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

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const RouteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const features = [
  {
    icon: BoltIcon,
    title: "Instant Settlement",
    description: "Real-time finality on stablecoin transfers. No T+1 delays, no float, no uncertainty.",
  },
  {
    icon: RouteIcon,
    title: "Smart Routing",
    description: "Intelligent path optimization across multiple chains and liquidity sources for best execution.",
  },
  {
    icon: LayersIcon,
    title: "Multi-Chain Support",
    description: "Native support for Polygon, Ethereum, Arbitrum, Optimism, Base, and Lux Network.",
  },
  {
    icon: ClockIcon,
    title: "24/7 Operations",
    description: "Always-on infrastructure with 99.99% uptime SLA. No bank holidays, no cut-off times.",
  },
];

const stablecoins = [
  { name: "USDC", color: "#2775CA", issuer: "Circle" },
  { name: "USDT", color: "#26A17B", issuer: "Tether" },
  { name: "PYUSD", color: "#0070E0", issuer: "PayPal" },
  { name: "USDY", color: "#1E40AF", issuer: "Ondo" },
  { name: "EURC", color: "#2775CA", issuer: "Circle" },
];

export default function Orchestration() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#8B5CF6">Orchestration</ProductBadge>
          <HeroTitle>
            Move money at the speed of the internet
          </HeroTitle>
          <HeroSubtitle>
            Global payment orchestration powered by stablecoin rails.
            Real-time settlement, intelligent routing, and enterprise-grade reliability.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/payments" target="_blank">
              <SecondaryButton>View API Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Architecture Diagram */}
      <Section>
        <SectionHeader>
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Seamless money movement across fiat and crypto rails
          </SectionSubtitle>
        </SectionHeader>

        <DiagramContainer>
          <DiagramRow $center>
            <DiagramNode>Your Application</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Lux Orchestration API</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="secondary">Stablecoin Rails</DiagramNode>
            <DiagramNode $type="secondary">Fiat Rails</DiagramNode>
            <DiagramNode $type="secondary">FX Engine</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">USDC</DiagramNode>
            <DiagramNode $type="highlight">USDT</DiagramNode>
            <DiagramNode $type="highlight">SWIFT</DiagramNode>
            <DiagramNode $type="highlight">SEPA</DiagramNode>
            <DiagramNode $type="highlight">ACH</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </Section>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <StatValue $color="#22C55E">{"<"}3s</StatValue>
          <StatLabel>Settlement Time</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>6</StatValue>
          <StatLabel>Chains Supported</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>150+</StatValue>
          <StatLabel>Countries</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>30+</StatValue>
          <StatLabel>Currencies</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Stablecoins */}
      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Native Stablecoin Support</BlockTitle>
          <BlockText>
            Integrate the world's leading stablecoins with a single API.
            Automatic routing selects the optimal asset and chain for each transaction.
          </BlockText>
          <FeatureList>
            {stablecoins.map((coin, index) => (
              <FeatureItem key={index}>
                <FeatureCheck $color={coin.color}>
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>
                  <strong>{coin.name}</strong> by {coin.issuer}
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>create-transfer.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">const</span> transfer = <span class="keyword">await</span> lux.transfers.<span class="property">create</span>({
  <span class="property">amount</span>: <span class="string">"10000.00"</span>,
  <span class="property">currency</span>: <span class="string">"USD"</span>,
  <span class="property">source</span>: {
    <span class="property">type</span>: <span class="string">"stablecoin"</span>,
    <span class="property">asset</span>: <span class="string">"USDC"</span>,
    <span class="property">chain</span>: <span class="string">"polygon"</span>,
  },
  <span class="property">destination</span>: {
    <span class="property">type</span>: <span class="string">"bank_account"</span>,
    <span class="property">country</span>: <span class="string">"MX"</span>,
    <span class="property">currency</span>: <span class="string">"MXN"</span>,
  },
});

<span class="comment">// Settlement in under 3 seconds</span>
console.<span class="property">log</span>(transfer.<span class="property">status</span>); <span class="comment">// "completed"</span>`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>Built for Scale</SectionTitle>
          <SectionSubtitle>
            Enterprise infrastructure that grows with your business
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={2}>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardIcon $color="#8B5CF6">
                <feature.icon />
              </CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* API Example */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>payment-flow.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// 1. Create a payment intent</span>
<span class="keyword">const</span> intent = <span class="keyword">await</span> lux.intents.<span class="property">create</span>({
  <span class="property">amount</span>: <span class="string">"50000.00"</span>,
  <span class="property">currency</span>: <span class="string">"EUR"</span>,
  <span class="property">recipient</span>: <span class="string">"acct_abc123"</span>,
});

<span class="comment">// 2. Lux finds optimal route</span>
console.<span class="property">log</span>(intent.<span class="property">route</span>);
<span class="comment">// {</span>
<span class="comment">//   source: "USDC:polygon",</span>
<span class="comment">//   destination: "SEPA:EUR",</span>
<span class="comment">//   fee: "0.10%",</span>
<span class="comment">//   eta: "2s"</span>
<span class="comment">// }</span>

<span class="comment">// 3. Execute with one call</span>
<span class="keyword">const</span> payment = <span class="keyword">await</span> intent.<span class="property">execute</span>();`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <BlockTitle>Simple API, Complex Operations</BlockTitle>
          <BlockText>
            Our API abstracts the complexity of multi-rail payments.
            You describe the intent—we handle routing, conversion, and settlement.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Automatic chain and asset selection</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Real-time FX rates with locked pricing</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Webhook notifications for all state changes</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Full audit trail and compliance reporting</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Start moving money globally</CTATitle>
        <CTASubtitle>
          Get API access and start building with Lux Orchestration.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

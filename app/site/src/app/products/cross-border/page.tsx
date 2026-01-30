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
  SpecsTable,
  SpecsRow,
  SpecsLabel,
  SpecsValue,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../styles";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const corridors = [
  { from: "USA", to: "Mexico", currency: "MXN", method: "SPEI", speed: "Instant" },
  { from: "USA", to: "Nigeria", currency: "NGN", method: "Bank Transfer", speed: "Same Day" },
  { from: "UK", to: "India", currency: "INR", method: "IMPS/UPI", speed: "Instant" },
  { from: "EU", to: "Singapore", currency: "SGD", method: "FAST", speed: "Instant" },
  { from: "UK", to: "Philippines", currency: "PHP", method: "InstaPay", speed: "Instant" },
  { from: "USA", to: "Brazil", currency: "BRL", method: "PIX", speed: "Instant" },
];

const features = [
  {
    icon: GlobeIcon,
    title: "200+ Countries",
    description: "Send fiat and crypto payments to every country. All currencies supported with local payout.",
    color: "#3B82F6",
  },
  {
    icon: BoltIcon,
    title: "Instant Settlement",
    description: "Real-time settlement via blockchain. Fiat conversion and local payout in seconds.",
    color: "#22C55E",
  },
  {
    icon: BankIcon,
    title: "All Payment Rails",
    description: "SWIFT, SEPA, ACH, SPEI, PIX, UPI, FAST, and 50+ local payment networks.",
    color: "#8B5CF6",
  },
  {
    icon: ShieldIcon,
    title: "Compliance Built-In",
    description: "Automatic sanctions screening, KYC verification, and regulatory reporting.",
    color: "#FFFFFF",
  },
];

export default function CrossBorder() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#3B82F6">Global Payments</ProductBadge>
          <HeroTitle>
            Send money anywhere, instantly
          </HeroTitle>
          <HeroSubtitle>
            Fiat and crypto payments to 200+ countries. All currencies with
            real-time settlement and local rails.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/cross-border" target="_blank">
              <SecondaryButton>View API Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <StatValue $color="#3B82F6">200+</StatValue>
          <StatLabel>Countries</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>180+</StatValue>
          <StatLabel>Currencies</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{"<"}3s</StatValue>
          <StatLabel>Settlement</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>50+</StatValue>
          <StatLabel>Payment Rails</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Stablecoin infrastructure meets local payment rails
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

      {/* API Example */}
      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>One API for Global Payments</BlockTitle>
          <BlockText>
            Send payments to any country with a single API call. We handle
            FX conversion, compliance, and local payout automatically.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Automatic FX with locked rates</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Built-in sanctions and compliance screening</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Real-time status webhooks</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Transparent fee structure</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>cross-border-payment.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">const</span> payment = <span class="keyword">await</span> lux.payments.<span class="property">create</span>({
  <span class="property">amount</span>: <span class="string">"5000.00"</span>,
  <span class="property">sourceCurrency</span>: <span class="string">"USD"</span>,
  <span class="property">sourceMethod</span>: <span class="string">"stablecoin:USDC"</span>,

  <span class="property">destination</span>: {
    <span class="property">country</span>: <span class="string">"MX"</span>,
    <span class="property">currency</span>: <span class="string">"MXN"</span>,
    <span class="property">method</span>: <span class="string">"SPEI"</span>,
    <span class="property">accountNumber</span>: <span class="string">"014..."</span>,
    <span class="property">recipientName</span>: <span class="string">"Maria Garcia"</span>,
  },
});

console.<span class="property">log</span>(payment);
<span class="comment">// {</span>
<span class="comment">//   id: "pmt_abc123",</span>
<span class="comment">//   status: "completed",</span>
<span class="comment">//   fx_rate: "17.45",</span>
<span class="comment">//   amount_delivered: "87250.00 MXN",</span>
<span class="comment">//   fee: "5.00 USD"</span>
<span class="comment">// }</span>`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Corridors */}
      <Section>
        <SectionHeader>
          <SectionTitle>Popular Corridors</SectionTitle>
          <SectionSubtitle>
            Optimized routes for high-volume payment flows
          </SectionSubtitle>
        </SectionHeader>

        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Route</SpecsLabel>
            <SpecsLabel $header>Local Rail</SpecsLabel>
          </SpecsRow>
          {corridors.map((corridor, index) => (
            <SpecsRow key={index}>
              <SpecsValue>
                <strong>{corridor.from}</strong>
                <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>→</span>
                <strong>{corridor.to}</strong>
                <span style={{ marginLeft: '0.75rem', opacity: 0.5 }}>{corridor.currency}</span>
              </SpecsValue>
              <SpecsValue>
                {corridor.method}
                <span style={{ marginLeft: '0.75rem', color: '#22C55E' }}>{corridor.speed}</span>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      {/* Compliance */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>compliance-check.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// Automatic compliance checks</span>
<span class="keyword">const</span> payment = <span class="keyword">await</span> lux.payments.<span class="property">create</span>({
  <span class="property">amount</span>: <span class="string">"10000.00"</span>,
  <span class="property">destination</span>: { ... },

  <span class="comment">// Compliance is built-in</span>
  <span class="property">compliance</span>: {
    <span class="property">sanctions</span>: <span class="keyword">true</span>,  <span class="comment">// OFAC, EU, UN</span>
    <span class="property">pep</span>: <span class="keyword">true</span>,        <span class="comment">// PEP screening</span>
    <span class="property">aml</span>: <span class="keyword">true</span>,        <span class="comment">// AML checks</span>
  },
});

<span class="comment">// Check compliance status</span>
<span class="keyword">if</span> (payment.<span class="property">compliance</span>.<span class="property">status</span> === <span class="string">'cleared'</span>) {
  console.<span class="property">log</span>(<span class="string">'Payment approved'</span>);
} <span class="keyword">else</span> {
  console.<span class="property">log</span>(<span class="string">'Manual review required'</span>);
}`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <ProductBadge $color="#FFFFFF">Compliance</ProductBadge>
          <BlockTitle>Built-In Regulatory Compliance</BlockTitle>
          <BlockText>
            Every payment is automatically screened against global sanctions lists,
            PEP databases, and AML rules. Stay compliant without building your own
            compliance infrastructure.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>OFAC, EU, UN sanctions screening</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Politically Exposed Person (PEP) checks</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Transaction monitoring and alerts</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Regulatory reporting and audit trails</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Start sending globally</CTATitle>
        <CTASubtitle>
          Get API access and start processing cross-border payments.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

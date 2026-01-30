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
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../styles";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
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

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const walletTypes = [
  {
    icon: WalletIcon,
    title: "Custodial Wallets",
    description: "Fully managed wallet infrastructure. We handle key management, security, and operations.",
    color: "#22C55E",
  },
  {
    icon: ShieldIcon,
    title: "MPC Self-Custody",
    description: "Self-hosted multi-party computation. Threshold signing with your own key shares.",
    color: "#8B5CF6",
  },
  {
    icon: LayersIcon,
    title: "Multi-Chain",
    description: "Single wallet interface for Polygon, Ethereum, Arbitrum, Optimism, Base, and Lux.",
    color: "#3B82F6",
  },
  {
    icon: KeyIcon,
    title: "HSM-Backed",
    description: "Hardware security modules for key storage. AWS CloudHSM, Azure, and Thales support.",
    color: "#FFFFFF",
  },
];

const chains = [
  { name: "Ethereum", color: "#627EEA" },
  { name: "Polygon", color: "#8247E5" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Optimism", color: "#FF0420" },
  { name: "Base", color: "#0052FF" },
  { name: "Solana", color: "#9945FF" },
  { name: "Avalanche", color: "#E84142" },
  { name: "BNB Chain", color: "#F3BA2F" },
  { name: "Lux Network", color: "#22D3EE" },
  { name: "50+ More", color: "#666666" },
];

export default function Wallets() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22C55E">Wallets</ProductBadge>
          <HeroTitle>
            Enterprise wallet infrastructure
          </HeroTitle>
          <HeroSubtitle>
            Custodial and self-custody wallets for fiat, crypto, stablecoins, and securities.
            50+ chains with HSM-backed security and MPC threshold signing.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/wallets" target="_blank">
              <SecondaryButton>View API Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <StatValue $color="#22C55E">50+</StatValue>
          <StatLabel>Chains Supported</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>10,000+</StatValue>
          <StatLabel>Token Types</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>HSM/MPC</StatValue>
          <StatLabel>Key Security</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>SOC 2</StatValue>
          <StatLabel>Compliance</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Wallet Types */}
      <Section>
        <SectionHeader>
          <SectionTitle>Wallet Options</SectionTitle>
          <SectionSubtitle>
            Choose the custody model that fits your requirements
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={2}>
          {walletTypes.map((type, index) => (
            <Card key={index} $accent={type.color}>
              <CardIcon $color={type.color}>
                <type.icon />
              </CardIcon>
              <CardTitle>{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* API Example */}
      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Simple API, Powerful Features</BlockTitle>
          <BlockText>
            Create wallets, manage balances, and execute transactions with a
            clean, developer-friendly API. All complexity is handled by our
            infrastructure.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Create unlimited wallets per account</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Automatic gas management and optimization</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Real-time balance and transaction webhooks</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck>
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Built-in token approvals and transfers</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>create-wallet.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { Lux } <span class="keyword">from</span> <span class="string">'@luxbank/sdk'</span>;

<span class="keyword">const</span> lux = <span class="keyword">new</span> <span class="property">Lux</span>({ <span class="property">apiKey</span>: <span class="string">'sk_live_...'</span> });

<span class="comment">// Create a multi-chain wallet</span>
<span class="keyword">const</span> wallet = <span class="keyword">await</span> lux.wallets.<span class="property">create</span>({
  <span class="property">type</span>: <span class="string">'custodial'</span>,
  <span class="property">chains</span>: [<span class="string">'polygon'</span>, <span class="string">'ethereum'</span>],
  <span class="property">label</span>: <span class="string">'Treasury Operations'</span>,
});

console.<span class="property">log</span>(wallet.<span class="property">addresses</span>);
<span class="comment">// {</span>
<span class="comment">//   polygon: "0x1234...",</span>
<span class="comment">//   ethereum: "0x1234..."</span>
<span class="comment">// }</span>

<span class="comment">// Get unified balance</span>
<span class="keyword">const</span> balance = <span class="keyword">await</span> wallet.<span class="property">getBalance</span>({
  <span class="property">currency</span>: <span class="string">'USDC'</span>,
});
<span class="comment">// { total: "1250000.00", byChain: {...} }</span>`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Chains */}
      <Section>
        <SectionHeader>
          <SectionTitle>Multi-Chain Support</SectionTitle>
          <SectionSubtitle>
            One API, multiple networks
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={5}>
          {chains.map((chain, index) => (
            <Card key={index} $accent={chain.color}>
              <CardTitle style={{ color: chain.color }}>{chain.name}</CardTitle>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* MPC Self-Custody */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>mpc-wallet.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { LuxMPC } <span class="keyword">from</span> <span class="string">'@luxbank/mpc'</span>;

<span class="comment">// Initialize MPC with threshold scheme</span>
<span class="keyword">const</span> mpc = <span class="keyword">new</span> <span class="property">LuxMPC</span>({
  <span class="property">threshold</span>: <span class="number">2</span>,
  <span class="property">parties</span>: <span class="number">3</span>,
  <span class="property">keyShareHolders</span>: [
    { <span class="property">id</span>: <span class="string">'ops'</span>, <span class="property">type</span>: <span class="string">'internal'</span> },
    { <span class="property">id</span>: <span class="string">'security'</span>, <span class="property">type</span>: <span class="string">'internal'</span> },
    { <span class="property">id</span>: <span class="string">'backup'</span>, <span class="property">type</span>: <span class="string">'cold'</span> },
  ],
});

<span class="comment">// Create self-custody wallet</span>
<span class="keyword">const</span> wallet = <span class="keyword">await</span> mpc.<span class="property">generateWallet</span>({
  <span class="property">chain</span>: <span class="string">'polygon'</span>,
});

<span class="comment">// Sign requires 2-of-3 parties</span>
<span class="keyword">const</span> tx = <span class="keyword">await</span> mpc.<span class="property">sign</span>({
  <span class="property">walletId</span>: wallet.<span class="property">id</span>,
  <span class="property">transaction</span>: transfer,
});`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <ProductBadge $color="#8B5CF6">MPC Self-Custody</ProductBadge>
          <BlockTitle>Your Keys, Your Control</BlockTitle>
          <BlockText>
            For institutions requiring complete control, our MPC solution enables
            self-custody with threshold signing. No single party can access funds
            alone, eliminating single points of failure.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>2-of-3, 3-of-5, or custom threshold schemes</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Air-gapped cold storage support</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Social recovery with trusted parties</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Full audit trail and signing ceremonies</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Deploy wallet infrastructure today</CTATitle>
        <CTASubtitle>
          Get started with custodial or self-custody wallets.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

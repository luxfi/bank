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

const PoolIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const VaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const LendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const StakeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const defiProducts = [
  {
    icon: PoolIcon,
    title: "AMM & Liquidity Pools",
    description: "Deploy automated market makers with custom bonding curves. Concentrated liquidity, dynamic fees, and multi-asset pools.",
    color: "#22C55E",
  },
  {
    icon: LendIcon,
    title: "Lending & Borrowing",
    description: "Launch money markets with isolated pools, variable rates, and liquidation engines. Over-collateralized and flash loans.",
    color: "#3B82F6",
  },
  {
    icon: VaultIcon,
    title: "Yield Vaults",
    description: "Auto-compounding yield strategies. Deploy vaults that optimize returns across lending, staking, and LP farming.",
    color: "#8B5CF6",
  },
  {
    icon: StakeIcon,
    title: "Staking Infrastructure",
    description: "Liquid staking, restaking, and validator management. Stake ETH, SOL, and 20+ PoS networks.",
    color: "#FFFFFF",
  },
];

const protocols = [
  { name: "Uniswap V3", tvl: "$4.2B", type: "AMM" },
  { name: "Aave V3", tvl: "$12.1B", type: "Lending" },
  { name: "Curve", tvl: "$2.8B", type: "Stableswap" },
  { name: "Lido", tvl: "$28.5B", type: "Staking" },
  { name: "Compound", tvl: "$2.1B", type: "Lending" },
  { name: "Convex", tvl: "$1.9B", type: "Yield" },
];

export default function DeFi() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22C55E">DeFi Infrastructure</ProductBadge>
          <HeroTitle>
            Build DeFi products
          </HeroTitle>
          <HeroSubtitle>
            AMMs, lending protocols, yield vaults, and staking. Institutional-grade
            DeFi infrastructure with compliance built in.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/defi" target="_blank">
              <SecondaryButton>View Documentation</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Stats */}
      <StatsRow>
        <StatCard>
          <StatValue $color="#22C55E">$50B+</StatValue>
          <StatLabel>TVL Supported</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>20+</StatValue>
          <StatLabel>Chains</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>100+</StatValue>
          <StatLabel>Protocol Integrations</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>99.99%</StatValue>
          <StatLabel>Uptime</StatLabel>
        </StatCard>
      </StatsRow>

      {/* Architecture */}
      <Section>
        <SectionHeader>
          <SectionTitle>DeFi Stack</SectionTitle>
          <SectionSubtitle>
            Complete infrastructure for any DeFi product
          </SectionSubtitle>
        </SectionHeader>

        <DiagramContainer>
          <DiagramRow>
            <DiagramNode>Your DeFi App</DiagramNode>
            <DiagramNode>Institutional Clients</DiagramNode>
            <DiagramNode>Retail Users</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Lux DeFi SDK</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="secondary">AMM Engine</DiagramNode>
            <DiagramNode $type="secondary">Lending Core</DiagramNode>
            <DiagramNode $type="secondary">Vault Logic</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">Ethereum</DiagramNode>
            <DiagramNode $type="highlight">Polygon</DiagramNode>
            <DiagramNode $type="highlight">Arbitrum</DiagramNode>
            <DiagramNode $type="highlight">Lux Chain</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </Section>

      {/* Products */}
      <Section>
        <SectionHeader>
          <SectionTitle>DeFi Products</SectionTitle>
          <SectionSubtitle>
            Launch any DeFi product with institutional compliance
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={2}>
          {defiProducts.map((product, index) => (
            <Card key={index} $accent={product.color}>
              <CardIcon $color={product.color}>
                <product.icon />
              </CardIcon>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* AMM */}
      <TwoColumnSection>
        <ContentBlock>
          <ProductBadge $color="#22C55E">AMM</ProductBadge>
          <BlockTitle>Custom Automated Market Makers</BlockTitle>
          <BlockText>
            Deploy AMMs with your own bonding curves, fee structures, and
            liquidity incentives. Support for concentrated liquidity,
            weighted pools, and stableswap curves.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Concentrated liquidity (Uniswap V3 style)</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Custom bonding curves and fee tiers</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Multi-asset weighted pools</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Stableswap for pegged assets</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>create-pool.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { LuxDeFi } <span class="keyword">from</span> <span class="string">'@luxbank/defi'</span>;

<span class="keyword">const</span> defi = <span class="keyword">new</span> <span class="property">LuxDeFi</span>({ <span class="property">chain</span>: <span class="string">'polygon'</span> });

<span class="comment">// Create concentrated liquidity pool</span>
<span class="keyword">const</span> pool = <span class="keyword">await</span> defi.amm.<span class="property">createPool</span>({
  <span class="property">tokenA</span>: <span class="string">"USDC"</span>,
  <span class="property">tokenB</span>: <span class="string">"ETH"</span>,
  <span class="property">fee</span>: <span class="number">0.003</span>, <span class="comment">// 0.3%</span>
  <span class="property">tickSpacing</span>: <span class="number">60</span>,
});

<span class="comment">// Add liquidity with price range</span>
<span class="keyword">await</span> defi.amm.<span class="property">addLiquidity</span>({
  <span class="property">pool</span>: pool.<span class="property">address</span>,
  <span class="property">amountA</span>: <span class="string">"100000"</span>,
  <span class="property">amountB</span>: <span class="string">"50"</span>,
  <span class="property">priceLower</span>: <span class="number">1800</span>,
  <span class="property">priceUpper</span>: <span class="number">2200</span>,
});`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Lending */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>lending-market.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// Create isolated lending market</span>
<span class="keyword">const</span> market = <span class="keyword">await</span> defi.lending.<span class="property">createMarket</span>({
  <span class="property">collateralAsset</span>: <span class="string">"ETH"</span>,
  <span class="property">borrowAsset</span>: <span class="string">"USDC"</span>,
  <span class="property">ltv</span>: <span class="number">0.75</span>,        <span class="comment">// 75% LTV</span>
  <span class="property">liquidationThreshold</span>: <span class="number">0.82</span>,
  <span class="property">interestModel</span>: <span class="string">"variable"</span>,
});

<span class="comment">// Supply collateral and borrow</span>
<span class="keyword">await</span> defi.lending.<span class="property">supply</span>({
  <span class="property">market</span>: market.<span class="property">address</span>,
  <span class="property">amount</span>: <span class="string">"10.0"</span>, <span class="comment">// 10 ETH</span>
});

<span class="keyword">await</span> defi.lending.<span class="property">borrow</span>({
  <span class="property">market</span>: market.<span class="property">address</span>,
  <span class="property">amount</span>: <span class="string">"15000"</span>, <span class="comment">// 15k USDC</span>
});

<span class="comment">// Check health factor</span>
<span class="keyword">const</span> health = <span class="keyword">await</span> defi.lending.<span class="property">getHealthFactor</span>();
<span class="comment">// 1.45 (healthy)</span>`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <ProductBadge $color="#3B82F6">Lending</ProductBadge>
          <BlockTitle>Money Markets & Lending</BlockTitle>
          <BlockText>
            Launch lending protocols with isolated risk pools, variable interest
            rates, and automated liquidations. Support for over-collateralized
            loans, flash loans, and cross-margin.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#3B82F6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Isolated and cross-margin pools</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#3B82F6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Variable and fixed interest rates</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#3B82F6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Automated liquidation engine</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#3B82F6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Flash loan support</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      {/* Yield Vaults */}
      <TwoColumnSection>
        <ContentBlock>
          <ProductBadge $color="#8B5CF6">Yield</ProductBadge>
          <BlockTitle>Auto-Compounding Vaults</BlockTitle>
          <BlockText>
            Deploy yield vaults that automatically compound returns across
            lending, staking, and LP farming. Institutional-grade risk
            management with transparent strategies.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Auto-compounding yield strategies</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Multi-protocol diversification</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Real-time performance tracking</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Risk scoring and alerts</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>yield-vault.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// Create auto-compounding vault</span>
<span class="keyword">const</span> vault = <span class="keyword">await</span> defi.vaults.<span class="property">create</span>({
  <span class="property">name</span>: <span class="string">"Stablecoin Yield"</span>,
  <span class="property">depositToken</span>: <span class="string">"USDC"</span>,
  <span class="property">strategy</span>: <span class="string">"lending-optimizer"</span>,
  <span class="property">protocols</span>: [<span class="string">"aave"</span>, <span class="string">"compound"</span>],
});

<span class="comment">// Deposit into vault</span>
<span class="keyword">await</span> defi.vaults.<span class="property">deposit</span>({
  <span class="property">vault</span>: vault.<span class="property">address</span>,
  <span class="property">amount</span>: <span class="string">"100000"</span>,
});

<span class="comment">// Check vault performance</span>
<span class="keyword">const</span> stats = <span class="keyword">await</span> defi.vaults.<span class="property">getStats</span>(vault.<span class="property">address</span>);
console.<span class="property">log</span>(stats);
<span class="comment">// {</span>
<span class="comment">//   tvl: "5420000.00",</span>
<span class="comment">//   apy: "8.45%",</span>
<span class="comment">//   userShares: "100000.00"</span>
<span class="comment">// }</span>`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Protocol Integrations */}
      <Section>
        <SectionHeader>
          <SectionTitle>Protocol Integrations</SectionTitle>
          <SectionSubtitle>
            Connect to the best DeFi protocols
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          {protocols.map((protocol, index) => (
            <Card key={index}>
              <CardTitle>{protocol.name}</CardTitle>
              <CardDescription>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>TVL:</strong> {protocol.tvl}
                </div>
                <div>
                  <strong>Type:</strong>{" "}
                  <span style={{ color: '#22C55E' }}>{protocol.type}</span>
                </div>
              </CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* Compliance */}
      <Section>
        <SectionHeader>
          <SectionTitle>Institutional DeFi</SectionTitle>
          <SectionSubtitle>
            DeFi with compliance for regulated entities
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          <Card $accent="#FFFFFF">
            <CardIcon $color="#FFFFFF">
              <ShieldIcon />
            </CardIcon>
            <CardTitle>Permissioned Pools</CardTitle>
            <CardDescription>
              Deploy DeFi protocols with KYC-gated access. Whitelist verified
              counterparties for compliant institutional DeFi.
            </CardDescription>
          </Card>
          <Card $accent="#22C55E">
            <CardIcon $color="#22C55E">
              <ChartIcon />
            </CardIcon>
            <CardTitle>Risk Analytics</CardTitle>
            <CardDescription>
              Real-time risk monitoring, stress testing, and portfolio analytics.
              Institutional-grade risk management for DeFi.
            </CardDescription>
          </Card>
          <Card $accent="#3B82F6">
            <CardIcon $color="#3B82F6">
              <VaultIcon />
            </CardIcon>
            <CardTitle>Audit Trail</CardTitle>
            <CardDescription>
              Complete audit trail for every transaction. Regulatory reporting
              and compliance documentation built in.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to build DeFi?</CTATitle>
        <CTASubtitle>
          Launch institutional-grade DeFi products with our infrastructure.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

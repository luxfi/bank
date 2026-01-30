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

const CoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h6M9 15h6" />
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

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

const issuanceTypes = [
  {
    icon: CoinIcon,
    title: "Stablecoins",
    description: "Launch fiat-backed stablecoins (USD, EUR, GBP+) with audited reserves and multi-chain deployment.",
    color: "#FFFFFF",
  },
  {
    icon: ShieldIcon,
    title: "Security Tokens",
    description: "Issue compliant equity, debt, and fund tokens. Full STO infrastructure with cap table management.",
    color: "#22C55E",
  },
  {
    icon: LayersIcon,
    title: "Tokenized Assets",
    description: "Tokenize real-world assets: real estate, commodities, receivables, and alternative investments.",
    color: "#8B5CF6",
  },
  {
    icon: ChartIcon,
    title: "Bonds & Debt",
    description: "Issue on-chain bonds with automated coupon payments, maturity handling, and secondary trading.",
    color: "#3B82F6",
  },
];

export default function Issuance() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#FFFFFF">Digital Securities</ProductBadge>
          <HeroTitle>
            Issue any digital asset
          </HeroTitle>
          <HeroSubtitle>
            Stablecoins, security tokens, tokenized assets, and bonds.
            Compliant issuance infrastructure with multi-chain deployment.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/issuance" target="_blank">
              <SecondaryButton>View Documentation</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Architecture */}
      <Section>
        <SectionHeader>
          <SectionTitle>Issuance Architecture</SectionTitle>
          <SectionSubtitle>
            End-to-end infrastructure for stablecoin operations
          </SectionSubtitle>
        </SectionHeader>

        <DiagramContainer>
          <DiagramRow>
            <DiagramNode>Fiat Deposits</DiagramNode>
            <DiagramNode>Crypto Collateral</DiagramNode>
            <DiagramNode>Treasury Bills</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Reserve Management</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="secondary">Smart Contract Minting</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">Polygon</DiagramNode>
            <DiagramNode $type="highlight">Ethereum</DiagramNode>
            <DiagramNode $type="highlight">Arbitrum</DiagramNode>
            <DiagramNode $type="highlight">Lux</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </Section>

      {/* Features */}
      <Section>
        <SectionHeader>
          <SectionTitle>Complete Platform</SectionTitle>
          <SectionSubtitle>
            Everything you need to issue and manage stablecoins
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={2}>
          {issuanceTypes.map((type, index) => (
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

      {/* Reserve Management */}
      <TwoColumnSection>
        <ContentBlock>
          <ProductBadge $color="#FFFFFF">Reserve Management</ProductBadge>
          <BlockTitle>Transparent, Auditable Reserves</BlockTitle>
          <BlockText>
            Your stablecoin's reserves are managed with full transparency.
            Real-time proof of reserves, regular attestations, and automated
            reporting keep your users confident.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Real-time proof of reserves dashboard</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Monthly third-party attestations</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Automated mint/burn based on deposits</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#FFFFFF">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Multi-signature treasury controls</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>reserve-management.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { LuxIssuance } <span class="keyword">from</span> <span class="string">'@luxbank/issuance'</span>;

<span class="keyword">const</span> issuance = <span class="keyword">new</span> <span class="property">LuxIssuance</span>({
  <span class="property">token</span>: <span class="string">'ACMEUSD'</span>,
  <span class="property">chains</span>: [<span class="string">'polygon'</span>, <span class="string">'ethereum'</span>],
});

<span class="comment">// Check reserve status</span>
<span class="keyword">const</span> reserves = <span class="keyword">await</span> issuance.<span class="property">getReserves</span>();
console.<span class="property">log</span>(reserves);
<span class="comment">// {</span>
<span class="comment">//   totalSupply: "50000000.00",</span>
<span class="comment">//   reserves: {</span>
<span class="comment">//     cash: "25000000.00",</span>
<span class="comment">//     tbills: "25000000.00"</span>
<span class="comment">//   },</span>
<span class="comment">//   ratio: "1.00"</span>
<span class="comment">// }</span>

<span class="comment">// Mint new tokens</span>
<span class="keyword">await</span> issuance.<span class="property">mint</span>({
  <span class="property">amount</span>: <span class="string">"1000000.00"</span>,
  <span class="property">chain</span>: <span class="string">'polygon'</span>,
  <span class="property">recipient</span>: <span class="string">'0x...'</span>,
});`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Smart Contracts */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>stablecoin.sol</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="comment">// SPDX-License-Identifier: MIT</span>
<span class="keyword">pragma</span> solidity ^0.8.20;

<span class="keyword">import</span> <span class="string">"@openzeppelin/contracts/token/ERC20/ERC20.sol"</span>;
<span class="keyword">import</span> <span class="string">"@luxbank/contracts/Mintable.sol"</span>;

<span class="keyword">contract</span> <span class="property">AcmeUSD</span> <span class="keyword">is</span> ERC20, Mintable {
    <span class="keyword">constructor</span>() ERC20(<span class="string">"Acme USD"</span>, <span class="string">"ACMEUSD"</span>) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    <span class="keyword">function</span> <span class="property">mint</span>(
        <span class="keyword">address</span> to,
        <span class="keyword">uint256</span> amount
    ) <span class="keyword">external</span> onlyMinter {
        _mint(to, amount);
    }

    <span class="keyword">function</span> <span class="property">burn</span>(
        <span class="keyword">uint256</span> amount
    ) <span class="keyword">external</span> {
        _burn(msg.sender, amount);
    }
}`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <ProductBadge $color="#8B5CF6">Smart Contracts</ProductBadge>
          <BlockTitle>Battle-Tested Contracts</BlockTitle>
          <BlockText>
            Deploy with confidence using our audited smart contract templates.
            Built on OpenZeppelin with additional security features and
            role-based access control.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Audited by leading security firms</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Upgradeable proxy pattern</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Pause functionality for emergencies</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#8B5CF6">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Multi-chain deployment scripts</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      {/* Compliance */}
      <Section>
        <SectionHeader>
          <SectionTitle>Regulatory Compliance</SectionTitle>
          <SectionSubtitle>
            Built for regulated stablecoin issuance
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          <Card>
            <CardTitle>Licensing Support</CardTitle>
            <CardDescription>
              We help navigate money transmitter licenses, e-money licenses, and
              other regulatory requirements.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Reserve Attestations</CardTitle>
            <CardDescription>
              Monthly attestations from Big 4 accounting firms to verify
              reserve backing.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>AML/KYC Integration</CardTitle>
            <CardDescription>
              Built-in compliance tools for user verification, transaction
              monitoring, and reporting.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to issue your stablecoin?</CTATitle>
        <CTASubtitle>
          Talk to our team about launching your digital currency.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

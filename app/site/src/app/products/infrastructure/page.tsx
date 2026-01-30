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

// Icons
const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const CpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ServerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const AtomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
  </svg>
);

const infrastructure = [
  {
    icon: KeyIcon,
    title: "Lux KMS",
    description: "Enterprise key management with HSM integration. AWS CloudHSM, Azure Dedicated HSM, and Thales support.",
    color: "#8B5CF6",
  },
  {
    icon: CpuIcon,
    title: "Lux MPC",
    description: "Multi-party computation for threshold signing. Self-hosted custody with 2-of-3, 3-of-5, or custom schemes.",
    color: "#22D3EE",
  },
  {
    icon: UsersIcon,
    title: "Lux IAM",
    description: "Enterprise identity management. SAML, OIDC, OAuth 2.0 with role-based access control.",
    color: "#22C55E",
  },
  {
    icon: AtomIcon,
    title: "Post-Quantum Security",
    description: "Future-proof cryptography via Lux Node. CRYSTALS-Dilithium, Kyber, and SPHINCS+ support.",
    color: "#EC4899",
  },
  {
    icon: ServerIcon,
    title: "Node Infrastructure",
    description: "Full blockchain backend with bootnodes, validators, and archive nodes for complete sovereignty.",
    color: "#FFFFFF",
  },
  {
    icon: BrainIcon,
    title: "MCP Server",
    description: "Model Context Protocol for AI-powered bank operations. Natural language queries via ZAP protocol.",
    color: "#3B82F6",
  },
];

const pqcAlgorithms = [
  { name: "CRYSTALS-Dilithium", type: "Digital Signatures", level: "NIST Level 3" },
  { name: "CRYSTALS-Kyber", type: "Key Encapsulation", level: "NIST Level 3" },
  { name: "SPHINCS+", type: "Hash-Based Signatures", level: "NIST Level 5" },
  { name: "Hybrid Mode", type: "Classical + PQ", level: "Transition Ready" },
];

const mpcFeatures = [
  "Threshold signing (2-of-3, 3-of-5, custom)",
  "Shamir's Secret Sharing for key distribution",
  "Offline key generation and cold storage",
  "Social recovery with trusted parties",
  "No single point of failure",
  "Air-gapped signing ceremonies",
];

export default function Infrastructure() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22D3EE">Infrastructure</ProductBadge>
          <HeroTitle>
            Enterprise-grade security infrastructure
          </HeroTitle>
          <HeroSubtitle>
            Vertically integrated infrastructure stack with HSM, MPC, and post-quantum
            cryptography. Built for institutions that demand the highest security standards.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Talk to Sales</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial/guides/infrastructure" target="_blank">
              <SecondaryButton>View Documentation</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      {/* Architecture */}
      <Section>
        <SectionHeader>
          <SectionTitle>Architecture Overview</SectionTitle>
          <SectionSubtitle>
            Complete infrastructure stack from key management to consensus
          </SectionSubtitle>
        </SectionHeader>

        <DiagramContainer>
          <DiagramRow $center>
            <DiagramNode>Your Application</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Lux API</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="secondary">Lux IAM</DiagramNode>
            <DiagramNode $type="secondary">Lux KMS</DiagramNode>
            <DiagramNode $type="secondary">Lux MPC</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">HSM</DiagramNode>
            <DiagramNode $type="highlight">Threshold Signing</DiagramNode>
            <DiagramNode $type="highlight">Post-Quantum</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Lux Node (Consensus)</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </Section>

      {/* Infrastructure Cards */}
      <Section>
        <SectionHeader>
          <SectionTitle>Infrastructure Components</SectionTitle>
          <SectionSubtitle>
            Modular components that work together or standalone
          </SectionSubtitle>
        </SectionHeader>

        <CardGrid $cols={3}>
          {infrastructure.map((item, index) => (
            <Card key={index} $accent={item.color}>
              <CardIcon $color={item.color}>
                <item.icon />
              </CardIcon>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* MPC Section */}
      <TwoColumnSection id="mpc">
        <ContentBlock>
          <ProductBadge $color="#22D3EE">Lux MPC</ProductBadge>
          <BlockTitle>Self-Hosted Custody with Threshold Cryptography</BlockTitle>
          <BlockText>
            Multi-party computation enables secure key management without any single party
            having access to the complete key. Our threshold signing schemes ensure that
            compromise of one party cannot lead to asset loss.
          </BlockText>
          <FeatureList>
            {mpcFeatures.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureCheck $color="#22D3EE">
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>{feature}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </ContentBlock>

        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>mpc-signing.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { LuxMPC } <span class="keyword">from</span> <span class="string">'@luxbank/mpc'</span>;

<span class="keyword">const</span> mpc = <span class="keyword">new</span> <span class="property">LuxMPC</span>({
  <span class="property">threshold</span>: <span class="number">2</span>,
  <span class="property">parties</span>: <span class="number">3</span>,
  <span class="property">keyShareHolders</span>: [
    { <span class="property">id</span>: <span class="string">'party1'</span>, <span class="property">endpoint</span>: <span class="string">'https://p1.internal'</span> },
    { <span class="property">id</span>: <span class="string">'party2'</span>, <span class="property">endpoint</span>: <span class="string">'https://p2.internal'</span> },
    { <span class="property">id</span>: <span class="string">'party3'</span>, <span class="property">endpoint</span>: <span class="string">'https://p3.internal'</span> },
  ],
});

<span class="comment">// Generate distributed wallet</span>
<span class="keyword">const</span> wallet = <span class="keyword">await</span> mpc.<span class="property">generateWallet</span>({
  <span class="property">chain</span>: <span class="string">'polygon'</span>,
  <span class="property">currency</span>: <span class="string">'USDC'</span>,
});

<span class="comment">// Sign with threshold parties</span>
<span class="keyword">const</span> sig = <span class="keyword">await</span> mpc.<span class="property">sign</span>({
  <span class="property">walletId</span>: wallet.<span class="property">id</span>,
  <span class="property">transaction</span>: txData,
});`}</CodeContent>
        </CodeBlock>
      </TwoColumnSection>

      {/* Post-Quantum Section */}
      <Section id="pqc">
        <SectionHeader>
          <SectionTitle>Post-Quantum Cryptography</SectionTitle>
          <SectionSubtitle>
            Future-proof security against quantum computing attacks
          </SectionSubtitle>
        </SectionHeader>

        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Algorithm</SpecsLabel>
            <SpecsLabel $header>Type</SpecsLabel>
          </SpecsRow>
          {pqcAlgorithms.map((algo, index) => (
            <SpecsRow key={index}>
              <SpecsValue>
                <strong style={{ color: '#EC4899' }}>{algo.name}</strong>
                <span style={{ marginLeft: '0.75rem', opacity: 0.5 }}>{algo.level}</span>
              </SpecsValue>
              <SpecsValue>{algo.type}</SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      {/* PQC Code Example */}
      <TwoColumnSection>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>post-quantum.ts</CodeTab>
          </CodeHeader>
          <CodeContent>{`<span class="keyword">import</span> { LuxNode } <span class="keyword">from</span> <span class="string">'@luxbank/node'</span>;

<span class="keyword">const</span> node = <span class="keyword">new</span> <span class="property">LuxNode</span>({
  <span class="property">network</span>: <span class="string">'mainnet'</span>,
  <span class="property">crypto</span>: {
    <span class="comment">// Hybrid mode: classical + post-quantum</span>
    <span class="property">mode</span>: <span class="string">'hybrid'</span>,
    <span class="property">pqAlgorithm</span>: <span class="string">'dilithium3'</span>,
    <span class="property">classicAlgorithm</span>: <span class="string">'ecdsa-secp256k1'</span>,
  },
});

<span class="comment">// Generate post-quantum keypair</span>
<span class="keyword">const</span> keypair = <span class="keyword">await</span> node.crypto.<span class="property">generateKeypair</span>({
  <span class="property">algorithm</span>: <span class="string">'dilithium3'</span>,
});

<span class="comment">// Sign with hybrid scheme</span>
<span class="keyword">const</span> signature = <span class="keyword">await</span> node.crypto.<span class="property">sign</span>({
  <span class="property">message</span>: transactionData,
  <span class="property">keypair</span>,
  <span class="property">mode</span>: <span class="string">'hybrid'</span>,
});`}</CodeContent>
        </CodeBlock>

        <ContentBlock>
          <ProductBadge $color="#EC4899">Post-Quantum Ready</ProductBadge>
          <BlockTitle>Prepared for the Quantum Era</BlockTitle>
          <BlockText>
            Quantum computers pose an existential threat to current cryptographic systems.
            Our hybrid approach provides security today while building quantum resistance
            for tomorrow.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#EC4899">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>NIST-approved lattice-based algorithms</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#EC4899">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Hybrid mode for gradual transition</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#EC4899">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Hash-based signatures for long-term security</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#EC4899">
                <CheckIcon />
              </FeatureCheck>
              <FeatureText>Backward compatible with existing systems</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      {/* MCP Section */}
      <Section id="mcp">
        <SectionHeader>
          <SectionTitle>AI-Powered Operations</SectionTitle>
          <SectionSubtitle>
            Model Context Protocol for intelligent bank management
          </SectionSubtitle>
        </SectionHeader>

        <TwoColumnSection style={{ borderTop: 'none', padding: '2rem 0' }}>
          <ContentBlock>
            <ProductBadge $color="#3B82F6">MCP Server + ZAP Protocol</ProductBadge>
            <BlockTitle>Natural Language Banking</BlockTitle>
            <BlockText>
              Our MCP server exposes bank operations to AI assistants via secure
              tool interfaces. Combined with ZAP protocol for browser communication,
              operators can manage the entire platform through conversation.
            </BlockText>
            <FeatureList>
              <FeatureItem>
                <FeatureCheck $color="#3B82F6">
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>Query accounts, balances, and transactions</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureCheck $color="#3B82F6">
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>Initiate and approve payments</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureCheck $color="#3B82F6">
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>Generate compliance reports</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureCheck $color="#3B82F6">
                  <CheckIcon />
                </FeatureCheck>
                <FeatureText>Manage user permissions</FeatureText>
              </FeatureItem>
            </FeatureList>
          </ContentBlock>

          <CodeBlock>
            <CodeHeader>
              <CodeTab $active>mcp-tools.json</CodeTab>
            </CodeHeader>
            <CodeContent>{`{
  <span class="property">"tools"</span>: [
    {
      <span class="property">"name"</span>: <span class="string">"get_account_balance"</span>,
      <span class="property">"description"</span>: <span class="string">"Get balance for account"</span>,
      <span class="property">"parameters"</span>: {
        <span class="property">"account_id"</span>: { <span class="property">"type"</span>: <span class="string">"string"</span> }
      }
    },
    {
      <span class="property">"name"</span>: <span class="string">"create_payment"</span>,
      <span class="property">"description"</span>: <span class="string">"Create a new payment"</span>,
      <span class="property">"parameters"</span>: {
        <span class="property">"amount"</span>: { <span class="property">"type"</span>: <span class="string">"number"</span> },
        <span class="property">"currency"</span>: { <span class="property">"type"</span>: <span class="string">"string"</span> },
        <span class="property">"recipient"</span>: { <span class="property">"type"</span>: <span class="string">"string"</span> }
      }
    }
  ]
}`}</CodeContent>
          </CodeBlock>
        </TwoColumnSection>
      </Section>

      <CTASection>
        <CTATitle>Build on enterprise-grade infrastructure</CTATitle>
        <CTASubtitle>
          Contact us to learn how Lux Infrastructure can power your operations.
        </CTASubtitle>
        <Link href="https://cal.com/luxfi" target="_blank">
          <CustomButton>Talk to Sales</CustomButton>
        </Link>
      </CTASection>
    </PageContainer>
  );
}

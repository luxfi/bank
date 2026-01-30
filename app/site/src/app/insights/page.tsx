"use client";

import styled from "styled-components";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

// Stablecoin market data (would be from Artemis API in production)
const marketData = {
  totalSupply: "$190B+",
  monthlyVolume: "$2.5T+",
  activeWallets: "30M+",
  growthYoY: "+45%",
};

const stablecoinData = [
  { name: "USDT", supply: "$117B", share: "61%", color: "#26A17B" },
  { name: "USDC", supply: "$44B", share: "23%", color: "#2775CA" },
  { name: "DAI", supply: "$5.3B", share: "3%", color: "#F5AC37" },
  { name: "PYUSD", supply: "$1.2B", share: "0.6%", color: "#0070E0" },
  { name: "Other", supply: "$22B", share: "12%", color: "#666666" },
];

const chainData = [
  { name: "Ethereum", supply: "$95B", share: "50%", txVolume: "25%", color: "#627EEA" },
  { name: "Tron", supply: "$62B", share: "33%", txVolume: "20%", color: "#FF0013" },
  { name: "Solana", supply: "$5B", share: "3%", txVolume: "35%", color: "#9945FF" },
  { name: "Polygon", supply: "$2B", share: "1%", txVolume: "8%", color: "#8247E5" },
  { name: "Arbitrum", supply: "$3B", share: "2%", txVolume: "5%", color: "#28A0F0" },
  { name: "Base", supply: "$3B", share: "2%", txVolume: "4%", color: "#0052FF" },
];

const insights = [
  {
    id: "1",
    title: "Monthly Stablecoin Supply Reaches All-Time High",
    excerpt: "Total stablecoin supply has reached $190B+, driven primarily by USDT growth. USDC supply has also rebounded from the lows of late 2023.",
    date: "2026-01-28",
    category: "Market Data",
  },
  {
    id: "2",
    title: "Solana Overtakes Ethereum in Transaction Volume",
    excerpt: "Monthly transaction volume has hit record highs, surpassing $2.5T. Solana now processes more stablecoin volume than Ethereum, Tron and Base combined.",
    date: "2026-01-25",
    category: "Market Data",
  },
  {
    id: "3",
    title: "Active Stablecoin Wallets Grow 70% Year-Over-Year",
    excerpt: "Active stablecoin wallets have surpassed 30 million monthly. While Tron and BNB account for the majority, Polygon and Solana grew rapidly.",
    date: "2026-01-20",
    category: "Market Data",
  },
  {
    id: "4",
    title: "Enterprise Stablecoin Adoption Accelerates in LATAM",
    excerpt: "Brazil's PIX integration and Mexico's SPEI rails are driving institutional stablecoin adoption across Latin America.",
    date: "2026-01-15",
    category: "Regional",
  },
  {
    id: "5",
    title: "SEPA Instant Enables Real-Time EUR Stablecoin On/Off Ramps",
    excerpt: "European stablecoin infrastructure sees major upgrade with SEPA Instant integration enabling sub-second settlement.",
    date: "2026-01-10",
    category: "Regional",
  },
  {
    id: "6",
    title: "Post-Quantum Cryptography Standards Finalized by NIST",
    excerpt: "NIST finalizes CRYSTALS-Dilithium and Kyber standards, setting the stage for quantum-resistant financial infrastructure.",
    date: "2026-01-05",
    category: "Security",
  },
];

export default function InsightsPage() {
  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/global.jpg"
          showCard={false}
          imageTitle="Market Insights"
          responsiveHeight="250px"
        />
      </AnimatedDiv>

      <Container>
        {/* Market Overview */}
        <Section>
          <SectionHeader>
            <SectionTitle>Stablecoin Market Overview</SectionTitle>
            <PoweredBy>Data powered by <a href="https://artemis.xyz" target="_blank" rel="noopener noreferrer">Artemis</a></PoweredBy>
          </SectionHeader>

          <StatsGrid>
            <StatCard>
              <StatValue>{marketData.totalSupply}</StatValue>
              <StatLabel>Total Supply</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{marketData.monthlyVolume}</StatValue>
              <StatLabel>Monthly Volume</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{marketData.activeWallets}</StatValue>
              <StatLabel>Active Wallets</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{marketData.growthYoY}</StatValue>
              <StatLabel>YoY Growth</StatLabel>
            </StatCard>
          </StatsGrid>
        </Section>

        {/* Supply by Stablecoin */}
        <Section>
          <ChartTitle>Monthly Stablecoin Supply by Stablecoin</ChartTitle>
          <ChartDescription>
            Total stablecoin supply has reached an all-time high, driven primarily by USDT growth. USDC supply has also rebounded from the lows of late 2023.
          </ChartDescription>
          <ChartContainer>
            <BarChart>
              {stablecoinData.map((coin) => (
                <BarRow key={coin.name}>
                  <BarLabel>{coin.name}</BarLabel>
                  <BarTrack>
                    <BarFill $width={parseInt(coin.share)} $color={coin.color} />
                  </BarTrack>
                  <BarValue>{coin.supply}</BarValue>
                </BarRow>
              ))}
            </BarChart>
          </ChartContainer>
        </Section>

        {/* Supply by Chain */}
        <Section>
          <ChartTitle>Monthly Stablecoin Supply by Blockchain</ChartTitle>
          <ChartDescription>
            The majority of stablecoin supply continues to be on Ethereum, though Tron has seen rapid growth with roughly one-third of the supply.
          </ChartDescription>
          <ChartContainer>
            <BarChart>
              {chainData.map((chain) => (
                <BarRow key={chain.name}>
                  <BarLabel>{chain.name}</BarLabel>
                  <BarTrack>
                    <BarFill $width={parseInt(chain.share)} $color={chain.color} />
                  </BarTrack>
                  <BarValue>{chain.supply}</BarValue>
                </BarRow>
              ))}
            </BarChart>
          </ChartContainer>
        </Section>

        {/* Transaction Volume by Chain */}
        <Section>
          <ChartTitle>Monthly Stablecoin Transaction Volume by Blockchain</ChartTitle>
          <ChartDescription>
            Stablecoin transaction volume has reached record highs, surpassing $2.5T recently. Solana has overtaken Ethereum, Tron and Base as the blockchain with the largest share of transaction volume.
          </ChartDescription>
          <ChartContainer>
            <BarChart>
              {chainData.map((chain) => (
                <BarRow key={chain.name}>
                  <BarLabel>{chain.name}</BarLabel>
                  <BarTrack>
                    <BarFill $width={parseInt(chain.txVolume)} $color={chain.color} />
                  </BarTrack>
                  <BarValue>{chain.txVolume}</BarValue>
                </BarRow>
              ))}
            </BarChart>
          </ChartContainer>
        </Section>

        {/* Latest Insights */}
        <Section>
          <SectionTitle>Latest Insights</SectionTitle>
          <InsightsGrid>
            {insights.map((insight) => (
              <InsightCard key={insight.id}>
                <InsightCategory>{insight.category}</InsightCategory>
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightExcerpt>{insight.excerpt}</InsightExcerpt>
                <InsightDate>{new Date(insight.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</InsightDate>
              </InsightCard>
            ))}
          </InsightsGrid>
        </Section>

        {/* CTA */}
        <CTASection>
          <CTATitle>Want to dive deeper?</CTATitle>
          <CTAText>
            Access our full market data API for real-time stablecoin analytics.
          </CTAText>
          <CTAButtons>
            <CTAButton href="https://docs.lux.financial" target="_blank" rel="noopener noreferrer">
              View API Docs
            </CTAButton>
            <CTAButtonSecondary href="https://cal.com/luxfi" target="_blank">
              Talk to Sales
            </CTAButtonSecondary>
          </CTAButtons>
        </CTASection>
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px 96px;
`;

const Section = styled.section`
  margin-bottom: 64px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const SectionTitle = styled.h2`
  color: #FAFAFA;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const PoweredBy = styled.span`
  font-size: 12px;
  color: #666;

  a {
    color: #FFFFFF;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #888;
`;

const ChartTitle = styled.h3`
  color: #FAFAFA;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ChartDescription = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const ChartContainer = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: 16px;
  align-items: center;
`;

const BarLabel = styled.div`
  font-size: 14px;
  color: #FAFAFA;
  font-weight: 500;
`;

const BarTrack = styled.div`
  height: 24px;
  background: #1a1a1a;
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const BarValue = styled.div`
  font-size: 14px;
  color: #888;
  text-align: right;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.article`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #333;
  }
`;

const InsightCategory = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const InsightTitle = styled.h3`
  color: #FAFAFA;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const InsightExcerpt = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const InsightDate = styled.time`
  font-size: 12px;
  color: #666;
`;

const CTASection = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 16px;
`;

const CTATitle = styled.h3`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const CTAText = styled.p`
  color: #888;
  font-size: 16px;
  margin-bottom: 24px;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CTAButton = styled.a`
  display: inline-block;
  background: #FFFFFF;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;

const CTAButtonSecondary = styled.a`
  display: inline-block;
  background: transparent;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

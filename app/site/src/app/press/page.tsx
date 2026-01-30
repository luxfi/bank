"use client";

import styled from "styled-components";
import Link from "next/link";
import { CustomButton } from "@/components/Button";

const pressReleases = [
  {
    date: "Jan 20, 2025",
    title: "Lux Raises $85M Series B to Expand Global Banking Infrastructure",
    description: "Led by a16z crypto with participation from Coinbase Ventures and Galaxy Digital.",
    href: "/press/series-b-2025",
  },
  {
    date: "Jan 12, 2025",
    title: "Lux Achieves SOC 2 Type II Certification",
    description: "Independent audit confirms highest standards for security and compliance.",
    href: "/press/soc2-2025",
  },
  {
    date: "Dec 18, 2024",
    title: "Lux Processes $10 Billion in Cumulative Transaction Volume",
    description: "Milestone reached 18 months after launch, driven by crypto exchange adoption.",
    href: "/press/10b-milestone",
  },
  {
    date: "Nov 15, 2024",
    title: "Lux Obtains Major Payment Institution License in Singapore",
    description: "MAS license enables direct APAC expansion.",
    href: "/press/singapore-license",
  },
  {
    date: "Sep 5, 2024",
    title: "Lux Launches Real-Time Settlement for Stablecoin Transactions",
    description: "T+0 settlement now available for USDC and USDT across all supported chains.",
    href: "/press/realtime-settlement",
  },
  {
    date: "Jul 20, 2024",
    title: "Lux Raises $32M Series A to Scale Banking Infrastructure",
    description: "Round led by Paradigm to accelerate product development and global expansion.",
    href: "/press/series-a-2024",
  },
];

const mediaCoverage = [
  {
    outlet: "TechCrunch",
    title: "Lux is building the Stripe for crypto-native companies",
    date: "Jan 21, 2025",
    href: "https://techcrunch.com",
  },
  {
    outlet: "Forbes",
    title: "How Lux is Bridging DeFi and Traditional Banking",
    date: "Jan 15, 2025",
    href: "https://forbes.com",
  },
  {
    outlet: "The Block",
    title: "Inside Lux's Mission to Become the Galileo of DeFi",
    date: "Dec 28, 2024",
    href: "https://theblock.co",
  },
  {
    outlet: "CoinDesk",
    title: "Stablecoin Infrastructure Provider Lux Hits $10B in Volume",
    date: "Dec 18, 2024",
    href: "https://coindesk.com",
  },
  {
    outlet: "Bloomberg",
    title: "Crypto Banking Startup Lux Targets Traditional Finance",
    date: "Nov 30, 2024",
    href: "https://bloomberg.com",
  },
  {
    outlet: "Decrypt",
    title: "Lux Wants to Make Crypto as Easy as Traditional Banking",
    date: "Nov 12, 2024",
    href: "https://decrypt.co",
  },
];

const companyFacts = [
  { label: "Founded", value: "2022" },
  { label: "Headquarters", value: "San Francisco, CA" },
  { label: "Employees", value: "85+" },
  { label: "Total Funding", value: "$120M+" },
  { label: "Transaction Volume", value: "$10B+" },
  { label: "Countries Served", value: "45+" },
];

const leadership = [
  {
    name: "Alex Chen",
    role: "Co-Founder & CEO",
    bio: "Former engineering lead at Plaid. Stanford CS.",
  },
  {
    name: "Sarah Kim",
    role: "Co-Founder & CTO",
    bio: "Former Stripe infrastructure engineer. MIT.",
  },
  {
    name: "Michael Torres",
    role: "Chief Financial Officer",
    bio: "Former CFO at Anchorage Digital. Goldman Sachs.",
  },
  {
    name: "Emily Zhang",
    role: "Chief Compliance Officer",
    bio: "Former Head of Compliance at Circle. DOJ alum.",
  },
];

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
    </svg>
  );
}

export default function PressPage() {
  return (
    <PageContainer>
      {/* Hero */}
      <HeroSection>
        <HeroBadge>Press & Media</HeroBadge>
        <HeroTitle>Press Resources</HeroTitle>
        <HeroSubtitle>
          Everything you need to cover Lux
        </HeroSubtitle>
      </HeroSection>

      {/* Quick Actions */}
      <QuickActions>
        <ActionCard>
          <ActionIcon><DownloadIcon /></ActionIcon>
          <ActionContent>
            <ActionTitle>Press Kit</ActionTitle>
            <ActionDescription>Logos, screenshots, and brand guidelines</ActionDescription>
          </ActionContent>
          <ActionButton>Download ZIP</ActionButton>
        </ActionCard>
        <ActionCard>
          <ActionIcon>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
          </ActionIcon>
          <ActionContent>
            <ActionTitle>Press Contact</ActionTitle>
            <ActionDescription>Reach our communications team</ActionDescription>
          </ActionContent>
          <ActionEmail href="mailto:press@lux.financial">press@lux.financial</ActionEmail>
        </ActionCard>
      </QuickActions>

      {/* Company Facts */}
      <Section>
        <SectionTitle>Company Facts</SectionTitle>
        <FactsGrid>
          {companyFacts.map((fact) => (
            <FactCard key={fact.label}>
              <FactValue>{fact.value}</FactValue>
              <FactLabel>{fact.label}</FactLabel>
            </FactCard>
          ))}
        </FactsGrid>
      </Section>

      {/* Press Releases */}
      <Section>
        <SectionTitle>Press Releases</SectionTitle>
        <ReleasesList>
          {pressReleases.map((release) => (
            <ReleaseRow key={release.href} href={release.href}>
              <ReleaseDate>{release.date}</ReleaseDate>
              <ReleaseContent>
                <ReleaseTitle>{release.title}</ReleaseTitle>
                <ReleaseDescription>{release.description}</ReleaseDescription>
              </ReleaseContent>
            </ReleaseRow>
          ))}
        </ReleasesList>
      </Section>

      {/* Media Coverage */}
      <Section>
        <SectionTitle>Media Coverage</SectionTitle>
        <CoverageGrid>
          {mediaCoverage.map((item) => (
            <CoverageCard key={item.title} href={item.href} target="_blank">
              <CoverageOutlet>{item.outlet}</CoverageOutlet>
              <CoverageTitle>{item.title}</CoverageTitle>
              <CoverageFooter>
                <CoverageDate>{item.date}</CoverageDate>
                <ExternalIcon />
              </CoverageFooter>
            </CoverageCard>
          ))}
        </CoverageGrid>
      </Section>

      {/* Leadership */}
      <Section>
        <SectionTitle>Leadership</SectionTitle>
        <LeadershipGrid>
          {leadership.map((person) => (
            <LeaderCard key={person.name}>
              <LeaderAvatar>{person.name.split(' ').map(n => n[0]).join('')}</LeaderAvatar>
              <LeaderName>{person.name}</LeaderName>
              <LeaderRole>{person.role}</LeaderRole>
              <LeaderBio>{person.bio}</LeaderBio>
            </LeaderCard>
          ))}
        </LeadershipGrid>
      </Section>

      {/* Boilerplate */}
      <BoilerplateSection>
        <BoilerplateTitle>About Lux</BoilerplateTitle>
        <BoilerplateText>
          Lux is the financial infrastructure platform for crypto-native companies. We provide the banking rails,
          compliance tools, and payment infrastructure that enable businesses to build sophisticated financial
          products. From DeFi protocols to crypto exchanges to neobanks, Lux powers the next generation of
          financial services. Founded in 2022 and headquartered in San Francisco, Lux has processed over $10
          billion in transaction volume and serves customers in 45+ countries. The company is backed by leading
          investors including a16z crypto, Paradigm, Coinbase Ventures, and Galaxy Digital.
        </BoilerplateText>
        <CopyButton>Copy Boilerplate</CopyButton>
      </BoilerplateSection>
    </PageContainer>
  );
}

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;
`;

const HeroSection = styled.section`
  padding: 6rem 0 4rem;
  text-align: center;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.65);
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem 0 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`;

const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 10px;
  color: #8B5CF6;
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const ActionDescription = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.55);
`;

const ActionButton = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: white;
  background: #8B5CF6;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ActionEmail = styled.a`
  font-size: 1.3rem;
  font-weight: 500;
  color: #8B5CF6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.section`
  padding: 4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
`;

const FactsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FactCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
`;

const FactValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.25rem;
`;

const FactLabel = styled.div`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.45);
`;

const ReleasesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReleaseRow = styled(Link)`
  display: flex;
  gap: 2rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    padding-left: 0.5rem;
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ReleaseDate = styled.span`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.45);
  min-width: 120px;
`;

const ReleaseContent = styled.div`
  flex: 1;
`;

const ReleaseTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.25rem;
`;

const ReleaseDescription = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.55);
`;

const CoverageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CoverageCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
  }
`;

const CoverageOutlet = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: #8B5CF6;
  margin-bottom: 0.5rem;
`;

const CoverageTitle = styled.h4`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.4;
  flex: 1;
`;

const CoverageFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.45);
`;

const CoverageDate = styled.span`
  font-size: 1.2rem;
`;

const LeadershipGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LeaderCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
`;

const LeaderAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
  border-radius: 50%;
  font-size: 1.6rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const LeaderName = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 0.25rem;
`;

const LeaderRole = styled.div`
  font-size: 1.2rem;
  color: #8B5CF6;
  margin-bottom: 0.75rem;
`;

const LeaderBio = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
`;

const BoilerplateSection = styled.section`
  padding: 4rem 0;
`;

const BoilerplateTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
`;

const BoilerplateText = styled.p`
  font-size: 1.4rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
`;

const CopyButton = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

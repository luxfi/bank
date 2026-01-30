"use client";

import styled from "styled-components";

const badges = [
  {
    title: "SOC 2 Type II",
    description: "Certified",
    icon: ShieldIcon,
  },
  {
    title: "PCI DSS",
    description: "Level 1",
    icon: LockIcon,
  },
  {
    title: "ISO 27001",
    description: "Certified",
    icon: CertIcon,
  },
  {
    title: "GDPR",
    description: "Compliant",
    icon: GlobeIcon,
  },
  {
    title: "99.99%",
    description: "Uptime SLA",
    icon: CheckIcon,
  },
];

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

export default function TrustBadges() {
  return (
    <Container>
      <Label>Trusted by leading financial institutions</Label>
      <BadgesRow>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <Badge key={badge.title}>
              <BadgeIcon>
                <Icon />
              </BadgeIcon>
              <BadgeContent>
                <BadgeTitle>{badge.title}</BadgeTitle>
                <BadgeDescription>{badge.description}</BadgeDescription>
              </BadgeContent>
            </Badge>
          );
        })}
      </BadgesRow>
    </Container>
  );
}

const Container = styled.section`
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Label = styled.p`
  text-align: center;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 2rem;
`;

const BadgesRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BadgeIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BadgeContent = styled.div``;

const BadgeTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const BadgeDescription = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
`;

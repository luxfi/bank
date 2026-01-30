"use client";

import { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const stats = [
  { value: 2.4, suffix: "B+", label: "Transaction Volume", prefix: "$" },
  { value: 150, suffix: "+", label: "Financial Institutions", prefix: "" },
  { value: 45, suffix: "+", label: "Countries Supported", prefix: "" },
  { value: 99.99, suffix: "%", label: "Uptime SLA", prefix: "" },
];

function AnimatedNumber({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(value * easeOut);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  const formatted = value >= 10
    ? Math.round(displayValue).toLocaleString()
    : displayValue.toFixed(2);

  return (
    <StatValue ref={ref}>
      {prefix}{formatted}{suffix}
    </StatValue>
  );
}

export default function StatsSection() {
  return (
    <Container>
      <StatsGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label}>
            <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>
    </Container>
  );
}

const Container = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const StatValue = styled.div`
  font-size: 4rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.45);
`;

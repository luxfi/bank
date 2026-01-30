"use client";

import styled from "styled-components";

// Placeholder logos - replace with actual customer logos
const customers = [
  { name: "Partner Bank", type: "Bank" },
  { name: "Digital Exchange", type: "Exchange" },
  { name: "Payment Provider", type: "Payments" },
  { name: "Fintech Platform", type: "Fintech" },
  { name: "Global Treasury", type: "Enterprise" },
  { name: "Crypto Custodian", type: "Custody" },
];

export default function CustomerLogos() {
  return (
    <Container>
      <Label>Powering the next generation of finance</Label>
      <LogosGrid>
        {customers.map((customer) => (
          <LogoCard key={customer.name}>
            <LogoPlaceholder>{customer.name}</LogoPlaceholder>
            <LogoType>{customer.type}</LogoType>
          </LogoCard>
        ))}
      </LogosGrid>
    </Container>
  );
}

const Container = styled.section`
  padding: 4rem 0;
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

const LogosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LogoCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoPlaceholder = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 0.25rem;
`;

const LogoType = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.35);
`;

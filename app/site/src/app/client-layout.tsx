"use client";
import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import MailListForm from "@/components/MailListForm";
import Menu from "@/components/Menu";
import ChatWidget from "@/components/ChatWidget";

import StyledProviders from "@/providers/StylesProvider";
import styled from "styled-components";
import { LUX_BRAND } from "@luxbank/brand";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const hideMenu = ["/privacy-policy", "/terms-and-conditions"].includes(path);
  const { jurisdiction } = LUX_BRAND;
  const { legalEntity } = jurisdiction;
  const getTitle = {
    "/privacy-policy": `Privacy policy of ${legalEntity.name} trading as ${LUX_BRAND.name} (${legalEntity.shortName || LUX_BRAND.name})`,
    "/terms-and-conditions": "Terms & Conditions",
  }[path];

  const HeaderBlueBackground = () => {
    return (
      <HeaderContainer>
        <div>
          <h1>{getTitle}</h1>
        </div>
      </HeaderContainer>
    );
  };

  return (
    <StyledProviders>
      <body>
        {!hideMenu && <Menu />}
        {hideMenu && <HeaderBlueBackground />}
        <MainContent>
          {children}
        </MainContent>
        {path === "/contact" && <MailListForm />}
        <Footer />
        <ChatWidget />
      </body>
    </StyledProviders>
  );
}

const MainContent = styled.div`
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: #0B0F14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  width: 100%;
  height: 200px;

  div {
    display: flex;
    flex-direction: column;
    padding-block: 16px;
    width: 100%;
    max-width: 1120px;
    padding-inline: 2rem;
    height: 100%;
    justify-content: flex-end;
  }

  h1 {
    color: rgba(255, 255, 255, 0.92);
    font-size: 2.8rem;
    font-weight: 600;
  }
`;

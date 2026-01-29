"use client";
import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import MailListForm from "@/components/MailListForm";
import Menu from "@/components/Menu";

import StyledProviders from "@/providers/StylesProvider";
import styled from "styled-components";
import { LUX_BRAND } from "@luxbank/brand";

export default function RootLayout({
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
    <html lang="en_GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B0F14" />
        <meta
          name="description"
          content={`With ${LUX_BRAND.name}, we have removed the complexities, inefficiencies and expenses of traditional cross-border payments with our platform.`}
        />
        <meta
          property="og:title"
          content={`${LUX_BRAND.name} | Make payments seamlessly, without complexity and at lower costs, anytime and anywhere.`}
        />
        <meta
          property="og:description"
          content={`With ${LUX_BRAND.name}, we have removed the complexities, inefficiencies and expenses of traditional cross-border payments with our platform.`}
        />
        <meta property="og:url" content={`https://${LUX_BRAND.domains.primary}/`} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />

        <title>{LUX_BRAND.name}</title>
      </head>
      <StyledProviders>
        <body>
          {!hideMenu && <Menu />}
          {hideMenu && <HeaderBlueBackground />}
          <MainContent>
            {children}
          </MainContent>
          {path === "/contact" && <MailListForm />}
          <Footer />
        </body>
      </StyledProviders>
    </html>
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

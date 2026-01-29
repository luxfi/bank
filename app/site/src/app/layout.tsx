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
        <link rel="icon" href="/images/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00569e" />
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
          {hideMenu && <HeaderBlueBackground />}
          <div className="content">
            {!hideMenu && <Menu />}
            {children}
          </div>
          {path === "/contact" && <MailListForm />}
          <Footer />
        </body>
      </StyledProviders>
    </html>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  background-color: #00569e;
  width: 100%;
  height: 225px;

  div {
    display: flex;
    flex-direction: column;
    padding-block: 16px;
    width: 80vw;
    max-width: 1440px;
    height: 100%;
    justify-content: flex-end;
  }

  h1 {
    color: white;
    font-size: 32px;
  }
`;

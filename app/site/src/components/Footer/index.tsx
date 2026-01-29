import Link from "next/link";
import { LuxLogo } from "@luxfi/logo/react";
import { LUX_BRAND } from "@luxbank/brand";

import {
  Column,
  ColumnsContainer,
  ContentContainer,
  FooterContainer,
  LinksContainer,
} from "./styles";

export default function Footer() {
  const { jurisdiction } = LUX_BRAND;
  const currentYear = new Date().getFullYear();
  const address = jurisdiction.legalEntity.registeredAddress;

  return (
    <FooterContainer>
      <ContentContainer>
        <ColumnsContainer>
          <Column>
            <LuxLogo
              size={45}
              variant="white"
              style={{
                marginBottom: 16,
              }}
            />
            <p>{`${address.line1}, ${address.city}, ${address.postalCode}, ${address.country}`}</p>
            <p>{`${LUX_BRAND.name} - © Copyright ${currentYear}`}</p>
          </Column>
          <Column style={{ marginTop: "70px" }}>
            <p>{jurisdiction.disclaimers.general}</p>
            <p>Telephone calls may be recorded</p>
          </Column>
        </ColumnsContainer>
        <LinksContainer>
          <Link href="/privacy-policy">Privacy Policy</Link> |{" "}
          <Link href="/terms-and-conditions">Terms & Conditions</Link>
        </LinksContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            opacity: "0.6",
          }}
        >
          <p style={{ textAlign: "center", lineHeight: "2.8rem" }}>
            {jurisdiction.disclaimers.safeguarding}
          </p>
        </div>
      </ContentContainer>
    </FooterContainer>
  );
}

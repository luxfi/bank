import Image from "next/image";
import Link from "next/link";

import {
  Column,
  ColumnsContainer,
  ContentContainer,
  FooterContainer,
  LinksContainer,
} from "./styles";

export default function Footer() {
  return (
    <FooterContainer>
      <ContentContainer>
        <ColumnsContainer>
          <Column>
            <Image
              src="/images/cdax-logo-white.svg"
              alt="logo"
              width={191}
              height={45}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
            <p>27 Hope Street, Douglas, IM1 1AR, Isle of Man</p>
            <p>CDAX - © Copyright 2024</p>
          </Column>
          <Column style={{ marginTop: "70px" }}>
            <p>Licensed by the Isle of Man Financial Services Authority.</p>
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
            The money transmission services we provide do not constitute deposit
            taking activity and are not protected by a compensation scheme.
          </p>
        </div>
      </ContentContainer>
    </FooterContainer>
  );
}

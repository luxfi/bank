"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";
import { CustomButton } from "@/components/Button";
import { Column } from "@/components/Footer/styles";
import { IconText } from "@/components/IconText";
import ImageText from "@/components/ImageText";
import {
  CardContainer,
  CardItemsContainer,
  FeaturesContainer,
  Grid,
  Row,
} from "@/components/ImageText/styles";
import Text from "@/components/Text";

import { CheckOutlined } from "@ant-design/icons";

import { Card, ImgContainer, TextContainer } from "./styles";

const capabilities = [
  "Wallet and account provisioning",
  "Fiat on/off-ramp orchestration",
  "Cross-border payments and payout execution",
  "Reconciliation-ready reporting",
];

const compliance = [
  "On-chain risk monitoring",
  "Sanctions screening",
  "Travel Rule data exchange",
  "Configurable policy controls",
];

const infrastructure = [
  "Licensed custody partnerships",
  "End-to-end audit trails",
  "Webhook-level observability",
  "Enterprise-grade security",
];

export default function Home() {
  const router = useRouter();
  return (
    <>
      <AnimatedDiv style={{ paddingInline: "18px" }}>
        <Card>
          <TextContainer>
            <Text variant="title">
              Stablecoin Infrastructure for Financial Institutions
            </Text>
            <Text variant="body" color="#516686" style={{ fontWeight: 600 }}>
              {`Lux Bank is built for financial institutions—not consumers. We don't compete with your customer relationships or front-end.`}
            </Text>
            <Text variant="body" color="#516686">
              {`Embed stablecoin rails into your operations quickly, securely, and profitably—with bank-grade controls, reporting, and settlement. Banking services provided by Metropolitan Commercial Bank, Member FDIC.`}
            </Text>
            <Text variant="body_sm" color="#516686">
              {`Stablecoin services are not FDIC insured. Subject to eligibility and compliance approval.`}
            </Text>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
          </TextContainer>
        </Card>
        <ImgContainer>
          <Image
            src="/images/laptop.png"
            alt="Stablecoin Infrastructure for Financial Institutions"
            width={810}
            height={750}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </ImgContainer>
        <TextContainer $mobile>
          <Text variant="title" style={{ fontSize: "4rem" }}>
            B2B Stablecoin Rails Built for Scale
          </Text>
          <Text variant="body" color="#516686">
            Move USDC, USDT, and EURC globally with settlement in minutes.
          </Text>
          <Text variant="body" color="#516686">
            Banking services provided by Metropolitan Commercial Bank, Member FDIC.
          </Text>
          <Text variant="body_sm" color="#516686">
            *Subject to eligibility. Stablecoin services not FDIC insured.
          </Text>
          <Link href="https://app.lux.financial/registration" target="_blank">
            <CustomButton>Get Started</CustomButton>
          </Link>
        </TextContainer>
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/working_team.jpg"
          altText="Lux Bank Infrastructure"
          imgPlacement="left"
          title="Infrastructure-First. White-Label Ready."
          text="Lux Bank powers Lux.Financial so you can embed stablecoin rails into your operations. Your end users see fiat and familiar UX, while Lux Bank handles stablecoin orchestration behind the scenes. Custom branding and domain options available for platforms who want their own client-facing experience."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <CardContainer>
          <Text variant="subtitle">Why Financial Institutions Choose Lux Bank</Text>
          <CardItemsContainer>
            <IconText
              icon="/images/hand_money.svg"
              iconSize={96}
              title="Go Live in 2-4 Weeks"
              width={420}
              responsive
            />
            <IconText
              icon="/images/dollar.svg"
              iconSize={96}
              title="Your Compliance, Our Tools"
              width={420}
              responsive
            />
            <IconText
              icon="/images/eye.svg"
              iconSize={96}
              title="Full Audit Trail"
              width={420}
              responsive
            />
          </CardItemsContainer>
        </CardContainer>
      </AnimatedDiv>

      <AnimatedDiv rootMargin={1200}>
        <Text
          variant="subtitle"
          style={{ marginLeft: "48px", marginTop: "48px" }}
        >
          Platform Capabilities
        </Text>
        <FeaturesContainer>
          <Column>
            <Column style={{ marginBottom: "48px", marginTop: "32px" }}>
              <IconText title="Low-Code Integration" />
              {capabilities.map((item, index) => (
                <Row key={index}>
                  <Text variant="body" color="#516686">
                    {item}
                  </Text>
                  <CheckOutlined />
                </Row>
              ))}
            </Column>
            <Column style={{ marginTop: "48px", marginBottom: "48px" }}>
              <IconText title="Compliance Tools" />
              {compliance.map((item, index) => (
                <Row key={index}>
                  <Text variant="body" color="#516686">
                    {item}
                  </Text>
                  <CheckOutlined />
                </Row>
              ))}
            </Column>
          </Column>
          <Image
            className="girl"
            src="/images/girl.jpg"
            alt="feature"
            width={680}
            height={680}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </FeaturesContainer>
        <CardContainer style={{ display: "flex", justifyContent: "center" }}>
          <IconText title="Enterprise Infrastructure" />
          <Grid>
            {infrastructure.map((item, index) => (
              <Row key={index}>
                <Text variant="body" color="#516686">
                  {item}
                </Text>
                <CheckOutlined />
              </Row>
            ))}
          </Grid>
        </CardContainer>
      </AnimatedDiv>

      <AnimatedDiv>
        <BannerWithCard
          image="/images/ship.jpg"
          imgPositionY={"-180px"}
          height="580px"
          responsiveHeight="700px"
          title="Supported Currencies & Corridors"
          text="Lux Bank supports major stablecoins (USDC, USDT, EURC) with fiat settlement across key corridors. Configure supported currencies, payout destinations, corridor availability, and compliance rules per region."
          buttonText="Contact Sales"
          onClick={() => router.push("/contact")}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/security.jpg"
          altText="Enterprise Security"
          imgPlacement="right"
          title="Enterprise-Grade Security"
          text="Lux Bank operates with financial-grade security designed for regulated environments. Partnerships with licensed custody and fiat on/off-ramp providers, comprehensive audit logs, end-to-end traceability, and operational controls suitable for institutional risk and compliance teams."
          checkList={[
            "Licensed custody partnerships",
            "24/7 monitoring and incident response",
            "SOC 2 Type II compliant infrastructure",
          ]}
        />
      </AnimatedDiv>
    </>
  );
}

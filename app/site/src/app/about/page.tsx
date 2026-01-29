import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";
import ImageText from "@/components/ImageText";
import { LUX_BRAND } from "@luxbank/brand";

export default function About() {
  const { jurisdiction } = LUX_BRAND;
  const { legalEntity } = jurisdiction;

  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/about.jpg"
          height="520px"
          responsiveHeight="700px"
          imageTitle="About"
          title="Infrastructure for Financial Institutions"
          text={`Lux Bank is built for financial institutions—not consumers. We provide the stablecoin infrastructure layer that powers Lux.Financial, enabling businesses to embed compliant crypto rails into their operations without building from scratch.`}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/working_team.jpg"
          altText="B2B Focus"
          imgPlacement="left"
          title="B2B Stablecoin Infrastructure"
          text="While most stablecoin infrastructure focuses on consumer payment flows, Lux Bank focuses on the B2B layer—enabling businesses to hold, move, and convert stablecoins with full regulatory coverage and enterprise-grade security. We don't compete with your customer relationships or front-end."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/security.jpg"
          altText="Compliance"
          imgPlacement="right"
          title="Your Compliance, Our Tools"
          text="You keep full ownership of your compliance program and obligations (KYC, AML, KYB, ongoing monitoring). Lux Bank plugs into your existing framework with on-chain risk monitoring, sanctions screening, Travel Rule data exchange, and configurable policy controls aligned to your risk appetite."
          checkList={[
            "On-chain risk monitoring",
            "Sanctions screening integration",
            "Travel Rule data exchange",
            "Configurable policy controls",
          ]}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/global.jpg"
          altText="Enterprise Grade"
          imgPlacement="left"
          title="Enterprise-Grade Infrastructure"
          text="Lux Bank operates with financial-grade security designed for regulated environments. Partnerships with licensed custody and fiat on/off-ramp providers, comprehensive audit logs, end-to-end traceability, and operational controls suitable for institutional risk and compliance teams."
          checkList={[
            "Licensed custody partnerships",
            "Comprehensive audit logs",
            "Webhook-level observability",
            "24/7 monitoring and incident response",
          ]}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <BannerWithCard
          image="/images/ship.jpg"
          height="400px"
          responsiveHeight="500px"
          title="Go Live in 2-4 Weeks"
          text="Most partners go live in 2-4 weeks using Lux Bank's low-code APIs and prebuilt flows for wallet provisioning, fiat on/off-ramp orchestration, cross-border payments, and reconciliation-ready reporting."
        />
      </AnimatedDiv>
    </>
  );
}

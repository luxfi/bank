import AboutCard from "@/components/AboutCard";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

import { TeamCardsContainer } from "./styles";
import { luxTeam } from "./teamDescription";
import { LUX_BRAND } from "@luxbank/brand";

export default function About() {
  const { jurisdiction } = LUX_BRAND;
  const { legalEntity, regulators } = jurisdiction;
  const regulator = regulators[0];

  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/about.jpg"
          height="520px"
          responsiveHeight="700px"
          imageTitle="About"
          title="Meet The Team"
          text={`Our team of professionals have over 75 years combined experience in financial services. The business provides an alternative service from the banks for international foreign exchange and cross border payments. ${legalEntity.name} is licensed by the ${regulator.name} as a Money Transmission Services business.`}
        />
      </AnimatedDiv>
      <TeamCardsContainer>
        {luxTeam.map((member, index) => (
          <AboutCard key={index} member={member} />
        ))}
      </TeamCardsContainer>
    </>
  );
}

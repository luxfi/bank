import AboutCard from "@/components/AboutCard";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";

import { TeamCardsContainer } from "./styles";
import { cdaxTeam } from "./teamDescription";

export default function About() {
  return (
    <>
      <AnimatedDiv>
        <BannerWithCard
          image="/images/about.jpg"
          height="520px"
          responsiveHeight="700px"
          imageTitle="About"
          title="Meet The Team"
          text="Matthew and Chris are co-founders of Cdax Limited, an Isle of Man based foreign exchange company which launched in early 2022.  Our team of professionals have over 75 years combined experience in financial services. The business provides an alternative service from the banks for international foreign exchange and cross border payments.  Cdax Limited is licenced by the Isle of Man Financial Services Authority as a Money Transmission Services business with a class 8 licence. "
        />
      </AnimatedDiv>
      <TeamCardsContainer>
        {cdaxTeam.map((member, index) => (
          <AboutCard key={index} member={member} />
        ))}
      </TeamCardsContainer>
    </>
  );
}

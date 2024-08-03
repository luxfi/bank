"use client";
import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";
import { IconText } from "@/components/IconText";
import ImageText from "@/components/ImageText";
import PannelWithBackground from "@/components/PannelWithBackground";
import Text from "@/components/Text";

import { TitleContainer, ToolkitCard, ToolkitCardsContainer } from "./styles";
import { list } from "./toolkitList";

export default function OnlinePlatform() {
  return (
    <>
      <AnimatedDiv>
        <PannelWithBackground
          title="Online Platform - Handle currency exchange with ease"
          imgPath="/images/tower_fade.jpg"
          responsiveImgPath="/images/tower_full.jpg"
          responsiveHeight="480px"
          height={450}
          contentWidth={55}
          buttonText="Set up an account in minutes"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "https://app.cdaxforex.com/registration";
            a.target = "_blank";
            a.click();
          }}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/tablet.jpg"
          altText="Our platform gives you real-time visibility and puts you firmly in control of all your trading activity."
          imgPlacement="right"
          title="Our platform gives you real-time visibility and puts you firmly in control of all your trading activity."
          text="Our intelligent tools will help you manage foreign exchange fluctuations, consolidate multiple conversions and maintain multi-currency balances – all in one place. It allows you to easily manage and automate tedious payment processes so you can keep pace with today’s realities."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/working_team2.jpg"
          altText="Manage Conversions Independently"
          imgPlacement="left"
          title="Manage Conversions Independently"
          subtitle="Handle conversions with ease."
          text="It allows you to take control and manage your trades without our help – wherever you are and whenever you need to. Get full visibility of any potential financial impact before making changes, to help drive smarter business decisions and manage your FX exposure. Save time and money by managing it all yourself, without needing to call the advisor."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/laptop_cdax_app.jpg"
          altText="Payment tracking tool"
          imgPlacement="right"
          title="Payment tracking tool"
          subtitle="Use our payment trace and tracking functionality, removing the need to contact customer support."
          text="Our payment tracking tool gives you complete visibility and transparency over any payment you have sent via the SWIFT network. It allows you to quickly find missing or delayed payments and gives you complete certainty when funds have arrived in a beneficiary account."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <BannerWithCard
          image="/images/security.jpg"
          title="Security"
          height="500px"
          responsiveHeight="500px"
          subtitle="We are end to end encrypted."
          text="This means that all your data and money is secure with us."
        />
      </AnimatedDiv>

      <div style={{ marginBottom: "24px" }}>
        <TitleContainer>
          <Text variant="title" style={{ marginBottom: "3rem" }}>
            Your complete toolkit to managing your currencies
          </Text>
        </TitleContainer>
        <ToolkitCardsContainer>
          {list.map((item: { title: string; text: string }, index) => (
            <ToolkitCard key={index} rootMargin={200}>
              <IconText title={item.title} />
              <Text variant="body" color="#516686">
                {item.text}
              </Text>
            </ToolkitCard>
          ))}
        </ToolkitCardsContainer>
      </div>
    </>
  );
}

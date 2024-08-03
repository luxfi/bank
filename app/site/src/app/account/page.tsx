"use client";

import AnimatedDiv from "@/components/AnimatedDiv";
import BannerWithCard from "@/components/BannerWithCard";
import { IconText } from "@/components/IconText";
import ImageText from "@/components/ImageText";
import PannelWithBackground from "@/components/PannelWithBackground";

import { ListContainer } from "./styles";

export default function Account() {
  return (
    <>
      <AnimatedDiv style={{ paddingBottom: "48px" }}>
        <PannelWithBackground
          title="CDAX Account"
          imgPath="/images/airplane_fade.jpg"
          responsiveImgPath="/images/airplane_full.jpg"
          height={595}
          contentWidth={50}
          responsiveHeight="480px"
          buttonText="Open an account"
          onClick={() => {
            const a = document.createElement("a");
            a.href = "https://app.cdaxforex.com/registration";
            a.target = "_blank";
            a.click();
          }}
        >
          <ListContainer>
            <IconText
              icon="/images/clock_icon.svg"
              title="Access real time FX rates"
            />
            <IconText icon="/images/convert_icon.svg" title="Named Accounts" />
            <IconText
              icon="/images/monitor_icon.svg"
              title="Convert all major Currencies"
            />
            <IconText
              icon="/images/magnifier_icon.svg"
              title="Local and international account details"
            />
          </ListContainer>
        </PannelWithBackground>
      </AnimatedDiv>

      <AnimatedDiv>
        <BannerWithCard
          image="/images/global.jpg"
          height={"500px"}
          responsiveHeight={"560px"}
          title="Moving money across borders can be a costly and slow process. "
          text="CDAX offers you a bank beating tool that gives you access to multiple currencies, simply and efficiently, with significant savings in time and money."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          imgPlacement="left"
          image="/images/accounts.jpg"
          altText="Named accounts"
          title="Named accounts"
          subtitle="Get named account details to receive money from around the world.*"
          text="You will be able to have named accounts with your business name as well as account number and sort code (for our UK customers only) in addition to a dedicated IBAN number for each of their currency accounts."
          checkList={[
            "Named account",
            "Account number and sort code",
            "IBAN number",
          ]}
          disclaimer="*Applies to some of the currencies only, subject to jurisdiction."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          imgPlacement="right"
          image="/images/smartphone.jpg"
          altText="Real-time FX rates"
          title="Real-time FX rates"
          subtitle="Banks provide a static day rate. We provide real-time FX rates from the Interbank market."
          text="We give you a flexible tool that gives you access to real-time FX rates, at minimum cost, while allowing you to manage risk and minimise your FX exposure."
          checkList={[
            "Real-time FX rates",
            "Convert 38 currencies",
            "No hidden fees",
          ]}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          imgPlacement="left"
          image="/images/global_2.jpg"
          altText="Hold balances in multiple currencies"
          title="Hold balances in multiple currencies"
          text="With us, you’ll have access to multi-currency account functionality that gives you the ability to hold money in 34 different currencies and pay out in 37 different currencies. Moving money across the globe is now hassle-free, without the need to set up bank accounts in different countries."
          checkList={[
            "Hold 34 currencies",
            "Pay out in 37 currencies",
            "Account details such as IBAN, sort code, routing number",
          ]}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          imgPlacement="right"
          image="/images/hand_currency.jpg"
          altText="Forwards and drawdowns"
          title="Forwards and drawdowns"
          subtitle="Manage your foreign exchange exposure."
          text="Our forwards and drawdowns options give you the flexibility and control to book foreign exchange (FX) forwards and then draw them down in whole or part, at any point in time. You lock in rates up to a year in advance, while drawing down the funds you need, when you need them."
          checkList={["Future proof: lock in rates up to 12 months in advance"]}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          imgPlacement="left"
          image="/images/tablet_shield.jpg"
          altText="Protecting you and your money"
          title="Protecting you and your money"
          text="Protecting your money is our top priority. Apart from safeguarding your money, we use two-factor authentication to protect your account and transactions. Our platforms undergo regular penetration testing and are protected against vulnerabilities such as code injection attacks or cross-site scripting attacks. Additionally, our compliance team comes with years of experience in banking at leading financial institutions. We work very hard ensuring that not only are we following our strict regulatory framework but we also push boundaries further to detect anomalous behaviour and potential fraud."
          checkList={[
            "Safeguarding your money",
            "Licensed by the Isle of Man Financial Service Authority",
            "Secure transactions",
          ]}
        />
      </AnimatedDiv>
    </>
  );
}

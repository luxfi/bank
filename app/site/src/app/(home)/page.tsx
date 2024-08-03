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
import UserSteps from "@/components/UserSteps";

import { CheckOutlined } from "@ant-design/icons";

import { collect, convert, manage } from "./lists";
import { Card, ImgContainer, TextContainer } from "./styles";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <AnimatedDiv style={{ paddingInline: "18px" }}>
        <Card>
          <TextContainer>
            <Text variant="title">
              Foreign currency exchange and onward payments at ultra competitive
              rates
            </Text>
            <Text variant="body" color="#516686" style={{ fontWeight: 600 }}>
              {`We can provide fuss free and simple solutions to meet your
            international business needs and internal treasury management
            requirements.`}
            </Text>
            <Text variant="body" color="#516686">
              {` Whether it’s a straightforward currency exchange or payments to
            multiple overseas clients, international employee’s salary or
            paying overseas suppliers we can provide the solution that meets
            your needs.`}
            </Text>
            <Text variant="body_sm" color="#516686">
              {`Subject to jurisdiction. We reserve the right to decline any
            application without explanation.`}
            </Text>
            <Link href="https://app.cdaxforex.com/registration" target="_blank">
              <CustomButton>Set up an account in minutes</CustomButton>
            </Link>
          </TextContainer>
        </Card>
        <ImgContainer>
          <Image
            src="/images/laptop.png"
            alt="Foreign currency exchange and onward payments at ultra competitive
            rates"
            width={810}
            height={750}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </ImgContainer>
        <TextContainer $mobile>
          {/* Show on mobile only */}
          <Text variant="title" style={{ fontSize: "4rem" }}>
            Convert money at competitive rates according to your own
            preferences.
          </Text>
          <Text variant="body" color="#516686">
            We are licensed by the Isle of Man Financial Services Authority.
          </Text>
          <Text variant="body" color="#516686">
            We never touch your money - it’s stored in accounts held with
            reputable banks.
          </Text>
          <Text variant="body_sm" color="#516686">
            *Subject to jurisdiction. We reserve the right to decline any
            application without explanation.
          </Text>
          <Link href="https://app.cdaxforex.com/registration" target="_blank">
            <CustomButton>Set up an account in minutes</CustomButton>
          </Link>
        </TextContainer>
      </AnimatedDiv>

      <AnimatedDiv>
        <ImageText
          image="/images/working_team.jpg"
          altText="CDAX"
          imgPlacement="left"
          title="CDAX is a specialist online money transmission services provider based in the Isle of Man."
          text="Specialising in international currency exchange and treasury services we are licenced by the Isle of Man Financial Services Authority as a provider of money transmission services.  We can offer a friction free online solution to help manage all your foreign currency needs in one place.  Our simple to use platform enables you to exchange currencies and make cross border payments effectively and efficiently at highly competitive rates when compared to traditional payment channels."
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <CardContainer>
          <Text variant="subtitle">Cost Saving</Text>
          <CardItemsContainer>
            <IconText
              icon="/images/hand_money.svg"
              iconSize={96}
              title="No setup fee"
              width={420}
              responsive
            />
            <IconText
              icon="/images/dollar.svg"
              iconSize={96}
              title="Cheaper than traditional banks"
              width={420}
              responsive
            />
            <IconText
              icon="/images/eye.svg"
              iconSize={96}
              title="No hidden fees"
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
          Standard Features
        </Text>
        <FeaturesContainer>
          <Column>
            <Column style={{ marginBottom: "48px", marginTop: "32px" }}>
              <IconText title="Collections and Payments" />
              {collect.map((item, index) => (
                <Row key={index}>
                  <Text variant="body" color="#516686">
                    {item}
                  </Text>
                  <CheckOutlined />
                </Row>
              ))}
            </Column>
            <Column style={{ marginTop: "48px", marginBottom: "48px" }}>
              <IconText title="Currency Conversion" />
              {convert.map((item, index) => (
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
          <IconText title="Manage" />
          <Grid>
            {manage.map((item, index) => (
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
          title="CDAX for larger businesses and institutions"
          text="Our team of experienced professionals can assist you with your foreign currency needs and treasury management solutions. Speak to us to hear how CDAX can work for your business"
          buttonText="Speak to a consultant"
          onClick={() => router.push("/contact")}
        />
      </AnimatedDiv>

      <AnimatedDiv>
        <UserSteps />
      </AnimatedDiv>
    </>
  );
}

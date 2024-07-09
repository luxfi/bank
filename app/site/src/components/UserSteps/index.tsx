import Image from "next/image";
import Link from "next/link";

import { CustomButton } from "../Button";
import Text from "../Text";
import { ArrowIcon, Container, StepsImageContainer, StepsLine } from "./styles";

export default function UserSteps() {
  return (
    <Container>
      <Text variant="subtitle">Get set up and start trading</Text>
      <StepsLine>
        <Text variant="body">Register in minutes</Text>
        <ArrowIcon />
        <Text variant="body">Submit your Due Diligence documents</Text>
        <ArrowIcon />
        <Text variant="body">Fund your account</Text>
        <ArrowIcon />
        <Text variant="body">Convert currency and make payments</Text>
      </StepsLine>
      <StepsImageContainer>
        <Image
          src="/images/steps_illustration.svg"
          alt="arrow"
          width={700}
          height={65}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
        <Text variant="body" style={{ fontSize: "16px" }}>
          *All applications subject to acceptance and satisfactory completion of
          verification requirements.
        </Text>
        <Link href="https://app.cdaxforex.com/registration" target="_blank">
          <CustomButton>Open an account</CustomButton>
        </Link>
      </StepsImageContainer>
    </Container>
  );
}

'use client';

import { Row, Text, useTheme } from '@cdaxfx/ui';

import { Container, Divider } from './styles';

export default function About() {
  const { theme } = useTheme();

  return (
    <Container>
      <Text variant="headline_regular">About</Text>

      <div>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          135485C27
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          Hope Street, Douglas, IM1 1AR, Isle of Man
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          CDAX Forex - © Copyright 2023
        </Text>
      </div>

      <div>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          Licensed by the Isle of Man Financial Services Authotity.
        </Text>
        <Text
          variant="body_sm_regular"
          color={theme.textColor.interactive.placeholder.value}
        >
          CDAX Forex is a registered trading name of CDAX Limited.
        </Text>
        <Row align="center" gap="xxxs">
          <Text
            variant="body_sm_bold"
            color={theme.textColor.interactive.placeholder.value}
          >
            Registered office:
          </Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.interactive.placeholder.value}
            style={{ flexDirection: 'row' }}
          >
            27 Hope Street, Douglas, Isle of Man, IM1 1AR
          </Text>
        </Row>
        <Row align="center" gap="xxxs">
          <Text
            variant="body_sm_bold"
            color={theme.textColor.interactive.placeholder.value}
          >
            Company number:
          </Text>
          <Text
            variant="body_sm_regular"
            color={theme.textColor.interactive.placeholder.value}
          >
            135485C
          </Text>
        </Row>
      </div>

      <Text
        variant="body_sm_regular"
        color={theme.textColor.interactive.placeholder.value}
      >
        The money transmission services we provide do not constitute deposit
        taking activity and are not protect by a compensation scheme
      </Text>

      <Row justify="center" align="center" gap="lg">
        <Text
          variant="interactive_md_link"
          href="https://www.cdaxforex.com/privacy-policy"
          color={theme.textColor.interactive.default.value}
        >
          Privacy Policy
        </Text>
        <Divider />
        <Text
          variant="interactive_md_link"
          href="https://www.cdaxforex.com/terms-and-conditions"
          color={theme.textColor.interactive.default.value}
        >
          Terms & Conditions
        </Text>
      </Row>
    </Container>
  );
}

'use client';
import Lottie from 'react-lottie';

import checkAnimation from '@/animations/check.json';
import { Column, Text } from '@cdaxfx/ui';

import { Container } from '../styles';

export default function RequestRegistrationSucess() {
  return (
    <Container>
      <Column align="center" width="100%" height="100%" justify="center">
        <Lottie
          options={{
            animationData: checkAnimation,
            loop: false,
            autoplay: true,
          }}
          style={{
            width: '125px',
            height: '125px',
            marginBottom: '1rem',
          }}
        />
        <Column align="center" gap="xs" style={{ marginTop: '1rem' }}>
          <Text variant="headline_regular" color={'#fff'}>
            Your request has been sent.
          </Text>
          <Text variant="body_md_regular" color={'#fff'}>
            As soon as we analyze your data, we will contact you by email or
            phone
          </Text>
        </Column>
      </Column>
    </Container>
  );
}

'use client';

import Lottie from 'react-lottie';

import animationLoading from '@/animations/stepConvert.json';
import { Icon, useTheme } from '@luxbank/ui';

import { Container, ContainerIcon, Line } from './styles';

const animationOptions = {
  loop: true,
  autoplay: true,
  animationData: animationLoading,
};

interface IProps {
  isAnimated?: boolean;
  onClick?(): void;
  disabled?: boolean;
}

export const DividerCurrencyInvertConversion: React.FC<IProps> = ({
  isAnimated,
  onClick,
  disabled,
}) => {
  const { theme } = useTheme();

  return (
    <Container
      onClick={() => onClick && onClick()}
      style={{
        marginBlock: isAnimated ? 18 : 32,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <Line />

      {isAnimated ? (
        <Lottie options={animationOptions} height={80} width={80} />
      ) : (
        <ContainerIcon
          style={{
            borderColor: disabled
              ? theme.borderColor.layout['divider-subtle'].value
              : theme.backgroundColor.interactive['primary-default'].value,
          }}
        >
          <Icon
            variant="sort-vertical"
            size="md"
            color={
              disabled
                ? theme.borderColor.layout['divider-subtle'].value
                : theme.textColor.interactive.default.value
            }
          />
        </ContainerIcon>
      )}
      <Line />
    </Container>
  );
};

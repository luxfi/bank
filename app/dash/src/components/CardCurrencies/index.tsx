'use client';

import CountUp from 'react-countup';

import { Column, Row, Text, useTheme } from '@cdaxfx/ui';

import { Flag } from '../Flag';
import { Container, TextWithEllipsis } from './styles';

interface IProps {
  code: string;
  name: string;
  amount: number;
  onClick(): void;
}

export const CardCurrencies: React.FC<IProps> = ({
  amount,
  code,
  name,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <Container onClick={onClick}>
      <Row justify="space-between" align="center">
        <Column style={{ gap: 4 }}>
          <CountUp
            style={{ color: theme.textColor.layout.primary.value }}
            start={0}
            end={amount}
            decimal="."
            decimals={2}
            className="count"
          />
          <Row style={{ gap: 4 }}>
            <TextWithEllipsis>
              <Text
                color={theme.textColor.layout.secondary.value}
                variant="caption_regular"
              >
                {name}
              </Text>
            </TextWithEllipsis>
            <Text
              color={theme.textColor.layout.secondary.value}
              variant="caption_bold"
            >{`• ${code}`}</Text>
          </Row>
        </Column>
        <Flag flagCode={code.slice(0, 2)} size={32} />
      </Row>
    </Container>
  );
};

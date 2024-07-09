import CountUp from 'react-countup';

import { Icon, Row, Text } from '@cdaxfx/ui';

import { Container } from './styles';

interface IProps {
  label: string;
  value: number;
  color?: string;
  onClick(): void;
}

export const CardTotal: React.FC<IProps> = ({
  label,
  onClick,
  value,
  color,
}) => {
  return (
    <Container onClick={onClick}>
      <Row
        style={{ flex: 1, paddingRight: 8 }}
        justify="space-between"
        align="center"
      >
        <Text variant="body_sm_semibold">{label}</Text>

        <CountUp
          style={{ color: color }}
          start={0}
          end={value}
          decimal="."
          className="count"
        />
      </Row>
      <Icon variant="arrow-right" size="sm" />
    </Container>
  );
};

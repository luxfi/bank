import CountUp from 'react-countup';

import {
  Icon,
  Row,
  TIconVariants,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { Container } from './styles';

interface IProps {
  status: string;
  description: string;
  value: number;
  icon: TIconVariants;
  onClick(): void;
}

export const CardStatus: React.FC<IProps> = ({
  description,
  icon,
  value,
  status,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <Container onClick={onClick}>
      <Text variant="body_md_semibold">{status}</Text>
      <Text
        color={theme.textColor.layout.secondary.value}
        variant="body_sm_regular"
      >
        {description}
      </Text>

      <Row align="center" gap="xs" style={{ marginTop: 4 }}>
        {/* <Text variant="heading_title_2">{value}</Text> */}
        <CountUp
          style={{ color: theme.textColor.layout.primary.value }}
          start={0}
          end={value}
          decimal="."
          className="count"
        />
        <Icon
          variant={icon}
          color={theme.backgroundColor.feedback.warningAccent.value}
        />
      </Row>
    </Container>
  );
};

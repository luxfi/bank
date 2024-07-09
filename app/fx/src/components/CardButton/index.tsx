import {
  Column,
  Icon,
  Row,
  TIconVariants,
  Text,
  useTheme,
} from '@cdaxfx/ui';

import { Container } from './styles';

interface IProps {
  icon: TIconVariants;
  label: string;
  description: string;
  onClick?(): void;
}

export const CardButton: React.FC<IProps> = ({
  description,
  label,
  icon,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <Container
      style={{ cursor: onClick ? 'pointer' : undefined }}
      onClick={() => onClick && onClick()}
    >
      <Row align="center" style={{ gap: 4 }}>
        <Icon
          variant={icon}
          color={theme.textColor.interactive.default.value}
        />
        <Column>
          <Text style={{ fontWeight: 500 }} variant="body_md_semibold">
            {label}
          </Text>
          <Text
            color={theme.textColor.layout.secondary.value}
            variant="caption_regular"
          >
            {description}
          </Text>
        </Column>
      </Row>
    </Container>
  );
};

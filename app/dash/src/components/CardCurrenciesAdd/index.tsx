import { Column, Icon, Row, Text, useTheme } from '@cdaxfx/ui';

import { Container } from './styles';

interface IProps {
  onClick(): void;
}

export const CardCurrenciesAdd: React.FC<IProps> = ({ onClick }) => {
  const { theme } = useTheme();

  return (
    <Container onClick={onClick}>
      <Row justify="space-between" align="center">
        <Column style={{ gap: 4 }}>
          <Text
            color={theme.textColor.interactive.default.value}
            variant="body_md_bold"
          >
            Add
          </Text>
          <Text
            color={theme.textColor.interactive.default.value}
            variant="callout_regular"
          >{`A currency`}</Text>
        </Column>
        <Icon
          variant="dollar-minimalistic"
          color={theme.textColor.interactive.default.value}
        />
      </Row>
    </Container>
  );
};

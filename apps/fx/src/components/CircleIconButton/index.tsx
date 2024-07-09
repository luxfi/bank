import { Icon, TIconVariants } from '@cdaxfx/ui';

import { Button, Container, Label } from './styles';

interface IProps {
  label: string;
  onClick(): void;
  icon: TIconVariants;
}

export const CircleIconButton: React.FC<IProps> = ({
  label,
  onClick,
  icon,
}) => {
  return (
    <Container>
      <Button onClick={onClick}>
        <Icon size={'sm'} variant={icon} />
      </Button>
      <Label>{label}</Label>
    </Container>
  );
};

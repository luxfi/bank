import { Container, Title } from './styles';

interface IProps {
  title: string;
}

export const UnderlineTitle: React.FC<IProps> = ({ title }) => {
  return (
    <Container>
      <Title>{title}</Title>
    </Container>
  );
};

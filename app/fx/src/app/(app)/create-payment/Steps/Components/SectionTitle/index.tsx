import { Container, Title, TitleContainer, UnderTitle } from './styles';

interface IProps {
  title?: string;
  underTitle?: string;
}

export default function SectionTitle(props: IProps) {
  const { title, underTitle } = props;

  return (
    <>
      <Container>
        {title && (
          <TitleContainer>
            <Title>{title}</Title>
          </TitleContainer>
        )}
      </Container>
      {underTitle && <UnderTitle>{underTitle}</UnderTitle>}
    </>
  );
}

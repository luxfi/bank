'use client';

import {
  Container,
  Body,
  Footer,
  Title,
  Header,
  LabelTitle,
  LabelValue,
} from './styles';

export interface IGridData {
  title: string;
  content: string | React.ReactNode;
}

interface IProps {
  title: string;
  dataSource: Array<IGridData>;
  headerAction?: React.ReactNode;
  footerAction?: React.ReactNode;
  containerStyle?: React.CSSProperties;
}

export default function DataGrid({
  title,
  dataSource,
  headerAction,
  footerAction,
  containerStyle,
}: IProps) {
  const getClassLine = (index: number) => {
    return index % 2 === 0 ? 'row-odd' : 'row-even';
  };

  return (
    <Container style={containerStyle}>
      <Header>
        <Title>{title}</Title>
        {headerAction && headerAction}
      </Header>

      <Body>
        {dataSource.map(({ title, content }, index) => (
          <>
            <LabelTitle className={getClassLine(index)}>{title}</LabelTitle>
            <LabelValue className={getClassLine(index)}>{content}</LabelValue>
          </>
        ))}
      </Body>

      <Footer>{footerAction && footerAction}</Footer>
    </Container>
  );
}

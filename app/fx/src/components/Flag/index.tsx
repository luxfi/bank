'use client';

import WorldFlag from 'react-world-flags';

import { Container } from './styles';

interface IProps {
  size?: number;
  flagCode: string;
  borderSize?: number;
}

export const Flag: React.FC<IProps> = ({
  borderSize = 1,
  size = 32,
  flagCode,
}) => {
  return (
    <Container borderSize={borderSize} size={size}>
      <WorldFlag code={flagCode} height={size * 2} width={size * 2} />
    </Container>
  );
};

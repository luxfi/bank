import { Container } from './styles';

interface IProps {
  height?: number;
  width?: number;
  borderRadius?: number;
}

export default function Skeleton({ height, width, borderRadius }: IProps) {
  return <Container style={{ height, width, borderRadius }} />;
}

import { Item } from './styles';

interface IProps {
  text: string;
  color?: string;
}

export default function ListItem({ text, color }: IProps) {
  return <Item color={color}>{text}</Item>;
}

import { LabelContainer, LabelContent, LabelTile } from './styles';

interface IProps {
  title: string;
  content?: string;
  widthLabelTitle?: number;
}

export default function Label({ content, title, widthLabelTitle }: IProps) {
  return (
    <LabelContainer>
      <LabelTile $widthLabelTitle={widthLabelTitle}>{title}</LabelTile>
      {content && <LabelContent>{content}</LabelContent>}
    </LabelContainer>
  );
}

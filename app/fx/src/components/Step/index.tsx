import { Icon } from '@cdaxfx/ui';

import {
  Container,
  ContainerDot,
  ContainerItem,
  ContainerLine,
  Label,
  LabelDot,
  Line,
} from './styles';

export interface IStepItems {
  title: string;
  description?: string;
}

interface IProps {
  items: Array<IStepItems>;
  current: number;
}

export default function Steps({ current, items }: IProps) {
  return (
    <Container>
      {items.map((item, index) => (
        <>
          <ContainerItem key={item.title}>
            <Label>{item.title}</Label>
            <ContainerDot $active={index <= current - 1}>
              {index <= current - 2 ? (
                <Icon variant="check" size="sm" />
              ) : (
                <LabelDot $active={index <= current - 1}>
                  {(index + 1).toString().padStart(2, '0')}
                </LabelDot>
              )}
            </ContainerDot>
          </ContainerItem>

          {index < items.length - 1 && (
            <ContainerLine>
              <Line $active={index <= current - 2} />
            </ContainerLine>
          )}
        </>
      ))}
    </Container>
  );
}

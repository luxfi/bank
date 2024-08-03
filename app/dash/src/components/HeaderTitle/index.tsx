import { useRouter } from 'next/navigation';

import { Icon, Row, Text } from '@luxbank/ui';
import styled from 'styled-components';

export function HeaderTitle({ title }: { title: string }) {
  const router = useRouter();
  return (
    <Row gap="xxxl" align="center" justify="space-between">
      <BackButton onClick={() => router.back()}>
        <Icon variant="arrow-left" />
        <Text variant="body_md_regular">Back</Text>
      </BackButton>
      <Text variant="headline_semibold">{title}</Text>
      <div></div>
    </Row>
  );
}

const BackButton = styled.button`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColor.interactive.default.value};
  gap: 16px;
  background: none;
  padding: 4px 16px;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  cursor: pointer;

  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.interactive['tertiary-hover'].value};
  }
`;

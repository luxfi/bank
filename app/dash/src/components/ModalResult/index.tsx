import Image from 'next/image';
import { useMemo } from 'react';

import { Modal } from 'antd';

import { Container, Subtitle, Title } from './styles';

interface IProps {
  isVisible: boolean;
  onCancel(): void;
  title: string;
  subtitle?: string;
  type: 'SUCCESS' | 'FAIL';
  closeOnBackgroundClick?: boolean;
  footer?: () => JSX.Element;
}

export default function ModalResult({
  isVisible,
  onCancel,
  type,
  title,
  subtitle,
  closeOnBackgroundClick = true,
  footer,
}: IProps) {
  const imageSRC = useMemo(() => {
    const baseType = {
      SUCCESS: '/image/RESULT_OK.png',
      FAIL: '/image/RESULT_FAIL.png',
    };

    return baseType[type];
  }, [type]);
  return (
    <Modal
      onCancel={() => onCancel()}
      open={isVisible}
      footer={() => footer?.()}
      width={'540px'}
      centered
      maskClosable={closeOnBackgroundClick}
    >
      <Container>
        <Image
          alt="Status icon"
          src={imageSRC}
          width={120}
          height={120}
          style={{ marginBottom: 24 }}
        />
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Container>
    </Modal>
  );
}

import Image from 'next/image';
import { useMemo } from 'react';

import { Button, Column, Icon, Row, TIconVariants } from '@luxbank/ui';
import { Modal } from 'antd';

import {
  MessageContainer,
  MessageDescription,
  MessageTitle,
  QuestionContainer,
  QuestionDescription,
  QuestionTitle,
} from './styles';

type TStatus = 'success' | 'fail';

export interface IMessageProps {
  isVisible: boolean;
  title: string;
  description: string;
  status?: TStatus;
  textButtonConfirm?: string;
  onConfirm?(): void;
  showConfirmButton?: boolean;
  onClose(): void;
}

export const Message: React.FC<IMessageProps> = ({
  description,
  isVisible,
  onConfirm,
  onClose,
  title,
  showConfirmButton,
  textButtonConfirm,
  status = 'success',
}) => {
  const imageSRC = useMemo(() => {
    const baseType: Record<TStatus, string> = {
      success: '/image/RESULT_OK.png',
      fail: '/image/RESULT_FAIL.png',
    };

    return baseType[status];
  }, [status]);

  return (
    <Modal
      onCancel={() => onClose()}
      open={isVisible}
      footer={() => null}
      width={'540px'}
      centered
      maskClosable={true}
    >
      <MessageContainer>
        <Image
          alt="Status icon"
          src={imageSRC}
          width={120}
          height={120}
          style={{ marginBottom: 24 }}
        />
        <MessageTitle>{title}</MessageTitle>
        {description && <MessageDescription>{description}</MessageDescription>}
        {showConfirmButton && (
          <Button
            onClick={() => onConfirm && onConfirm()}
            text={textButtonConfirm ?? 'Ok'}
            roundness="rounded"
            style={{ alignSelf: 'center' }}
          />
        )}
      </MessageContainer>
    </Modal>
  );
};

export interface IQuestionProps {
  isVisible: boolean;
  title: string;
  description?: string;
  textButtonConfirm?: string;
  textButtonCancel?: string;
  icon?: TIconVariants;
  onConfirm(): void;
  onCancel(): void;
}

export const Question: React.FC<IQuestionProps> = ({
  isVisible,
  icon,
  onCancel,
  onConfirm,
  title,
  description,
  textButtonCancel,
  textButtonConfirm,
}) => {
  return (
    <Modal
      onCancel={() => onCancel()}
      open={isVisible}
      footer={() => null}
      width={'516px'}
      closable={false}
      centered
      maskClosable={true}
    >
      <QuestionContainer>
        <Row gap="sm">
          <Icon variant={icon ?? 'exclamation-circle'} size="sm" />
          <Column>
            <QuestionTitle>{title}</QuestionTitle>
            {description && (
              <QuestionDescription>{description}</QuestionDescription>
            )}
          </Column>
        </Row>
        <Row gap="md" justify="flex-end" style={{ marginTop: 24 }}>
          <Button
            roundness="rounded"
            variant="secondary"
            text={textButtonCancel ?? 'No'}
            onClick={onCancel}
          />
          <Button
            roundness="rounded"
            text={textButtonConfirm ?? 'Yes'}
            onClick={onConfirm}
          />
        </Row>
      </QuestionContainer>
    </Modal>
  );
};

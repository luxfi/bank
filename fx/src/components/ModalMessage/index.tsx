import { LoadingOutlined } from '@ant-design/icons';
import { Button, Icon, Row, Text } from '@cdaxfx/ui';
import { Modal } from 'antd';

import { defaultTheme } from '@/styles/themes/default';

import { Container, ActionContainer } from './styles';
interface IProps {
  title: string;
  textButtonCancel?: string;
  textButtonConfirm?: string;
  isLoading?: boolean;
  description: string;
  isVisible: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export default function ModalMessage({
  description,
  isLoading,
  onCancel,
  onConfirm,
  title,
  textButtonCancel,
  textButtonConfirm,
  isVisible = true,
}: IProps) {
  return (
    <Modal
      onCancel={() => onCancel()}
      open={isVisible}
      footer={() => null}
      width={450}
      closeIcon={<></>}
      centered={true}
    >
      <Container>
        <Row gap="sm">
          <Icon variant="exclamation-circle" size="sm" />

          <div>
            <Text variant="body_md_bold">{title}</Text>
            <Text variant="body_sm_regular">{description}</Text>
          </div>
        </Row>

        <ActionContainer>
          <Button
            disabled={isLoading}
            size="small"
            variant="secondary"
            onClick={onCancel}
            roundness="rounded"
            text={textButtonCancel ?? 'Cancel'}
          />

          {isLoading ? (
            <LoadingOutlined
              style={{
                width: 96,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                color: defaultTheme.colors.secondary,
                fontSize: 16,
                fontWeight: 600,
              }}
            />
          ) : (
            <Button
              size="small"
              onClick={onConfirm}
              text={textButtonConfirm ?? 'Ok'}
              roundness="rounded"
            />
          )}
        </ActionContainer>
      </Container>
    </Modal>
  );
}

import { useCallback, useRef, useState } from 'react';

import {
  Button,
  Column,
  Icon,
  Text,
  useTheme,
} from '@cdaxfx/ui';
import { Modal } from 'antd';

import {
  Container,
  FileContainer,
  HiddenFileInput,
  SelectPictureContainer,
} from './styles';

interface IProps {
  isVisible: boolean;
  title: string;
  description?: string;
  onClose(value: false): void;
  onConfirm(value: File): void;
}

export const ModalUpload: React.FC<IProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const { theme } = useTheme();

  const [fileSelected, setFileSelected] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];

      setFileSelected(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];

      setFileSelected(file);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!fileSelected) return;

    onConfirm(fileSelected);
    onClose(false);
  }, [fileSelected, onClose, onConfirm]);

  return (
    <Modal
      onCancel={() => onClose(false)}
      open={isVisible}
      footer={() => null}
      width={600}
      centered={true}
    >
      <Container>
        <Text variant="body_md_bold">{title}</Text>
        {description && (
          <Text
            variant="body_sm_regular"
            color={theme.textColor.layout.secondary.value}
          >
            {description}
          </Text>
        )}

        <Column width="100%" align="center" justify="center" gap="xxs">
          {!fileSelected ? (
            <SelectPictureContainer
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              <HiddenFileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*,.pdf,.txt,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <Icon
                variant="inbox"
                color={theme.textColor.layout.emphasized.value}
                size="lg"
              />
              <Text variant="body_md_bold">
                Click or drag a file here to upload
              </Text>
            </SelectPictureContainer>
          ) : (
            <FileContainer>
              <Text variant="caption_regular">{fileSelected.name}</Text>
              <Icon
                onClick={() => setFileSelected(null)}
                style={{ cursor: 'pointer' }}
                variant="cross-circle"
                size="sm"
              />
            </FileContainer>
          )}
          <Text
            variant="caption_regular"
            color={theme.textColor.layout.secondary.value}
          >
            {fileSelected ? '1' : '0'} file loaded
          </Text>
        </Column>

        <Button
          disabled={!fileSelected}
          text="Submit"
          roundness="rounded"
          style={{ alignSelf: 'flex-end', marginTop: 32 }}
          onClick={() => handleSubmit()}
        />
      </Container>
    </Modal>
  );
};

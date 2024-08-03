import { IDocument } from '@/store/useClient/types';
import { Button, Column, Icon, Row, Text, useTheme } from '@luxbank/ui';
import { Spin } from 'antd';
import styled from 'styled-components';

interface IClientDocumentCard {
  label: string;
  document?: IDocument;
  type: 'required' | 'optional';
  loading?: boolean;
  onUploadClick: () => void;
  onRemoveClick: (id: string) => void;
  onDownloadClick: (doc: IDocument) => void;
}
export const ClientDocumentCard = ({
  label,
  document,
  type,
  loading,
  onUploadClick,
  onRemoveClick,
  onDownloadClick,
}: IClientDocumentCard) => {
  const { theme } = useTheme();
  return (
    <Row
      padding="sm"
      justify="space-between"
      gap="sm"
      style={{
        borderRadius: 8,
        backgroundColor: theme.backgroundColor.layout['container-L2'].value,
        width: '100%',
        marginTop: 16,
      }}
    >
      <Column>
        <Text
          variant="caption_regular"
          color={theme.textColor.layout.secondary.value}
        >
          {label}
        </Text>
        <div onClick={() => document && onDownloadClick(document)}>
          <Text
            variant="body_md_regular"
            color={
              document
                ? theme.textColor.interactive.default.value
                : theme.textColor.layout.primary.value
            }
            style={{
              textDecoration: document ? 'underline' : 'none',
              cursor: document ? 'pointer' : 'default',
            }}
          >
            {document?.originalFilename || 'none'}
          </Text>
        </div>
      </Column>

      {loading ? (
        <Column align="center" justify="center" width="100px" height="100%">
          <Spin />
        </Column>
      ) : (
        <>
          {type === 'required' ? (
            <Button
              variant={'tertiary'}
              roundness="rounded"
              text={document ? 'Delete' : 'Upload'}
              leftIcon={document ? 'trash-bin-trash' : 'file-send'}
              onClick={() =>
                document ? onRemoveClick(document.uuid) : onUploadClick()
              }
            />
          ) : (
            <CustomButton
              onClick={() => document && onRemoveClick(document?.uuid)}
            >
              <Row gap="xxxs" align="center">
                <Icon variant="trash-bin-trash" color="#ffffff" size="sm" />
                <Text variant="body_md_regular" color="#ffffff">
                  Delete
                </Text>
              </Row>
            </CustomButton>
          )}
        </>
      )}
    </Row>
  );
};

const CustomButton = styled.button`
  background-color: #ba452d;
  color: #ffffff;
  max-width: fit-content;
  border-radius: 8px;
  padding: 8px;
  width: 100%;
  padding-inline: 24px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

import Image from 'next/image';
import { useCallback, useState } from 'react';

import { Icon, Text, useTheme } from '@luxbank/ui';

import { ModalUpload } from '../ModalUpload';
import { Container, ImageContainer, IconPhotoContainer } from './styles';

interface IUploadImage {
  initials: string;
}

export const UploadImage: React.FC<IUploadImage> = ({ initials }) => {
  const { theme } = useTheme();

  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmitImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  return (
    <>
      <Container onClick={() => setModalIsVisible(true)}>
        <ImageContainer>
          {imageUrl ? (
            <Image src={imageUrl} alt="" width={80} height={80} />
          ) : (
            <Text
              variant="heading_title_1"
              color={theme.textColor.interactive['default-inverse'].value}
            >
              {initials}
            </Text>
          )}
        </ImageContainer>
        <IconPhotoContainer>
          <Icon variant="camera" size="sm" color="#002645" />
        </IconPhotoContainer>
      </Container>

      <ModalUpload
        isVisible={modalIsVisible}
        onClose={setModalIsVisible}
        onConfirm={handleSubmitImage}
        title="Set profile picture"
        description="Personalize your account by uploading an image that represents you."
      />
    </>
  );
};

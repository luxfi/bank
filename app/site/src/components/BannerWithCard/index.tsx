import Image, { StaticImageData } from "next/image";

import { CustomButton } from "../Button";
import Text from "../Text";
import { BannerCard, ImageContainer, MainContainer } from "./styles";

interface IBannerWithCard {
  title?: string;
  image: string | StaticImageData;
  imageTitle?: string;
  height?: string;
  responsiveHeight?: string;
  imgPositionY?: string;
  text?: string;
  subtitle?: string;
  buttonText?: string;
  showCard?: boolean;
  onClick?: () => void;
}
export default function BannerWithCard({
  image,
  imageTitle,
  imgPositionY,
  height,
  responsiveHeight,
  text,
  title,
  buttonText,
  subtitle,
  showCard = true,
  onClick,
}: IBannerWithCard) {
  return (
    <MainContainer
      $showCard={showCard}
      $height={height}
      $responsiveHeight={responsiveHeight}
    >
      <ImageContainer $positionY={imgPositionY}>
        <Image
          src={image}
          alt={title || ""}
          width={1400}
          height={900}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
        {imageTitle && (
          <Text
            variant="subtitle"
            style={{
              fontSize: "56px",
            }}
          >
            {imageTitle}
          </Text>
        )}
      </ImageContainer>
      {showCard && (
        <BannerCard>
          <Text variant="title">{title}</Text>
          {subtitle && (
            <Text variant="body_lg" color="#1E3456">
              {subtitle}
            </Text>
          )}
          <Text variant="body" color="#516686">
            {text}
          </Text>
          {buttonText && (
            <CustomButton onClick={onClick}>{buttonText}</CustomButton>
          )}
        </BannerCard>
      )}
    </MainContainer>
  );
}

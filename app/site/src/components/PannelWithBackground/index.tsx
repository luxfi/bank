import { PropsWithChildren } from "react";

import { CustomButton } from "../Button";
import Text from "../Text";
import { ButtonContainer, ContentContainer, PannelContainer } from "./styles";

interface IPannel extends PropsWithChildren {
  title: string;
  imgPath: string;
  responsiveImgPath?: string;
  responsiveHeight?: string;
  contentWidth: number;
  height: number;
  buttonText?: string;
  onClick?: () => void;
}

export default function PannelWithBackground({
  title,
  imgPath,
  responsiveImgPath,
  responsiveHeight,
  height,
  contentWidth,
  buttonText,
  children,
  onClick,
}: IPannel) {
  return (
    <PannelContainer
      $img={imgPath}
      $responsiveImg={responsiveImgPath}
      $height={height}
      $hasChildren={!!children}
      $responsiveHeight={responsiveHeight}
    >
      <ContentContainer $width={contentWidth}>
        <Text className="title" variant="title" color="#1E3456" weight="700">
          {title}
        </Text>
        {children}
        {buttonText && (
          <ButtonContainer>
            <CustomButton onClick={onClick}>{buttonText}</CustomButton>
          </ButtonContainer>
        )}
      </ContentContainer>
    </PannelContainer>
  );
}

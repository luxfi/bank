import Image from "next/image";

import Text from "../Text";
import {
  CustomIconCheck,
  ImageContainer,
  ImageTextContainer,
  ListContainer,
  ListItem,
  TextContainer,
} from "./styles";

interface IImageText {
  image: string;
  altText: string;
  imgPlacement: "left" | "right";
  title: string;
  subtitle?: string;
  text: string;
  checkList?: string[];
  disclaimer?: string;
}

export default function ImageText({
  image,
  altText,
  imgPlacement,
  title,
  subtitle,
  text,
  checkList,
  disclaimer,
}: IImageText) {
  return (
    <ImageTextContainer
      $imgPlacement={imgPlacement === "left" ? "row" : "row-reverse"}
    >
      <ImageContainer>
        <Image
          src={image}
          alt={altText}
          width={"460"}
          height={"460"}
          rel="preload"
          priority
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </ImageContainer>
      <TextContainer>
        <Text variant="title">{title}</Text>
        {subtitle && (
          <Text variant="subtitle" color="#1E3456">
            {subtitle}
          </Text>
        )}
        <Text variant="body" color="#1E3456" style={{ marginTop: "2.5rem" }}>
          {text}
        </Text>
        {checkList?.length && (
          <ListContainer>
            {checkList.map((item, index) => (
              <ListItem key={index}>
                <Text variant="body" color="#1E3456">
                  {item}
                </Text>
                <CustomIconCheck />
              </ListItem>
            ))}
          </ListContainer>
        )}
        {disclaimer && (
          <Text
            variant="body_sm"
            color="#1E3456"
            style={{ marginTop: "2.5rem" }}
          >
            {disclaimer}
          </Text>
        )}
      </TextContainer>
    </ImageTextContainer>
  );
}

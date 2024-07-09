'use client';

import React from 'react';
import { ICardProps } from './types';

import Styled from './styles';

const Card: React.FC<ICardProps> = ({
  children,
  align,
  backgroundColor,
  borderRadius,
  borderWidth,
  borderColor,
  shadow,
  padding,
  direction,
  gap,
  height,
  id,
  justify,
  margin,
  width,
  maxWidth,
  maxHeight,
  minHeight,
  minWidth,
  overflow,
  wrap,
  style,
}) => {
  return (
    <Styled.Container
      $align={align}
      $backgroundColor={backgroundColor}
      $borderRadius={borderRadius}
      $borderWidth={borderWidth}
      $borderColor={borderColor}
      $shadow={shadow}
      $padding={padding}
      $direction={direction}
      $gap={gap}
      $height={height}
      $id={id}
      $justify={justify}
      $margin={margin}
      $width={width}
      $overflow={overflow}
      $wrap={wrap}
      $minHeight={minHeight}
      $minWidth={minWidth}
      $maxHeight={maxHeight}
      $maxWidth={maxWidth}
      style={style}
    >
      {children}
    </Styled.Container>
  );
};

export default Card;

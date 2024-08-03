'use client';

import React from 'react';

import { IRowProps } from './types';

import Styled from './styles';

const Row: React.FC<IRowProps> = ({
  children,
  justify = 'flex-start',
  align = 'flex-start',
  gap,
  padding,
  margin,
  width,
  height,
  wrap = 'nowrap',
  style,
}) => {
  return (
    <Styled.Container
      $justify={justify}
      $align={align}
      $gap={gap}
      $padding={padding}
      $margin={margin}
      $wrap={wrap}
      $width={width}
      $height={height}
      style={style}
    >
      {children}
    </Styled.Container>
  );
};

export default Row;

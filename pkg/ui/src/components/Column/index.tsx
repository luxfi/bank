'use client';

import React from 'react';

import Styled from './styles';

import type { IColumnProps } from './types';

const Column: React.FC<IColumnProps> = ({
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

export default Column;

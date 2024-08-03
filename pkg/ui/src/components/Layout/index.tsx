'use client';

import React from 'react';

import Styled from './styles';

import type { ILayoutProps } from './types';

const Layout: React.FC<ILayoutProps> = ({
  children,
  fillContent,
  direction = 'row',
  justify = 'flex-start',
  align = 'flex-start',
  gap,
  rowGap,
  columnGap,
  gridRowGap,
  gridColumnGap,
  padding,
  margin,
  wrap = direction === 'row' ? 'wrap' : 'nowrap',
  backgroundColor,
  width,
  height,
  style,
}) => {
  return (
    <Styled.Container
      $fillContent={fillContent}
      $direction={direction}
      $justify={justify}
      $align={align}
      $gap={gap}
      $rowGap={rowGap}
      $columnGap={columnGap}
      $gridRowGap={gridRowGap}
      $gridColumnGap={gridColumnGap}
      $padding={padding}
      $margin={margin}
      $wrap={wrap}
      $backgroundColor={backgroundColor}
      $width={width}
      $height={height}
      style={style}
    >
      {children}
    </Styled.Container>
  );
};

export default Layout;

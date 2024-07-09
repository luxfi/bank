'use client';

import React, { useMemo } from 'react';

import icoMoonConfig from '../../styles/fonts/ds-icons.json';
import Styled from './styles';

import type { IIconProps } from './types';

const Icon: React.FC<IIconProps> = ({
  variant,
  size = 'md',
  color,
  onClick,
  style,
}) => {
  const iconCode = useMemo(
    () =>
      icoMoonConfig.icons.find(
        (i) => i.properties?.name.toLowerCase() === variant
      )?.properties?.code,
    [variant]
  );

  return (
    <Styled.Container
      $size={size}
      $color={color}
      onClick={onClick}
      style={style}
    >
      {iconCode ? String.fromCodePoint(iconCode) : '?'}
    </Styled.Container>
  );
};

export default Icon;

'use client';

import React from 'react';

import Styled from './styles';

import type { ITextProps } from './types';

const Text: React.FC<ITextProps> = ({
  children,
  variant,
  color,
  href,
  target,
  textAlign = 'left',
  as = 'p',
  htmlFor,
  id,
  style,
}) => {
  if (href) {
    return (
      <Styled.TextLink
        $variant={variant}
        $color={color}
        $textAlign={textAlign}
        href={href}
        target={target}
        id={id}
        style={style}
      >
        {children}
      </Styled.TextLink>
    );
  }

  return (
    <Styled.Text
      as={as}
      $variant={variant}
      $textAlign={textAlign}
      $color={color}
      htmlFor={htmlFor}
      id={id}
      style={style}
    >
      {children}
    </Styled.Text>
  );
};

export default Text;

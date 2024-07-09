'use client';

import React, { useMemo } from 'react';

import { useTheme } from '../../providers/Theme';
import Icon from '../Icon';
import Text from '../Text';
import Styled from './styles';

import type { IButtonProps, TButtonVariants } from './types';

const Button: React.FC<IButtonProps> = ({
  variant = 'primary',
  size = 'default',
  text = 'Button',
  leftIcon,
  rightIcon,
  isLoading,
  roundness = 'rounded',
  fillContent = false,
  ...props
}) => {
  const { theme } = useTheme();

  const textColors: { [key in TButtonVariants]: string } = useMemo(
    () => ({
      primary: theme.textColor.interactive['default-inverse'].value,
      secondary: theme.textColor.interactive.default.value,
      tertiary: theme.textColor.interactive.default.value,
      destructive: theme.textColor.layout['primary-inverse'].value,
    }),
    [theme.textColor.interactive, theme.textColor.layout]
  );

  const textColor = useMemo(
    () =>
      props.disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant],
    [
      props.disabled,
      textColors,
      theme.textColor.interactive.disabled.value,
      variant,
    ]
  );

  return (
    <React.Fragment>
      <Styled.Container
        $variant={variant}
        $size={size}
        $roundness={roundness}
        $fillContent={fillContent}
        $isLoading={isLoading}
        {...props}
      >
        {isLoading && !rightIcon && leftIcon && <Styled.LoadingAnimation />}

        {leftIcon && !isLoading && (
          <Icon
            variant={leftIcon}
            size={size === 'default' ? 'sm' : 'xs'}
            color={textColor}
          />
        )}

        <Text
          textAlign="center"
          variant={size === 'default' ? 'body_md_regular' : 'body_sm_regular'}
          color={textColor}
        >
          {text}
        </Text>

        {isLoading && (!leftIcon || rightIcon) && <Styled.LoadingAnimation />}

        {rightIcon && !isLoading && (
          <Icon
            variant={rightIcon}
            size={size === 'default' ? 'sm' : 'xs'}
            color={textColor}
          />
        )}
      </Styled.Container>
    </React.Fragment>
  );
};

export default Button;

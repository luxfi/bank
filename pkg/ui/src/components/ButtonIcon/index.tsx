'use client';

import React, { useMemo } from 'react';

import { useTheme } from '../../providers/Theme';
import Icon from '../Icon';
import Styled from './styles';

import type { IButtonIconProps, TButtonIconVariants } from './types';

const ButtonIcon: React.FC<IButtonIconProps> = ({
  variant = 'primary',
  size = 'default',
  roundness = 'none',
  disabled = false,
  onClick = () => {},
  icon,
  id,
  style,
}) => {
  const { theme } = useTheme();

  const textColors: { [key in TButtonIconVariants]: string } = useMemo(
    () => ({
      primary: theme.textColor.interactive['default-inverse'].value,
      secondary: theme.textColor.interactive.default.value,
      tertiary: theme.textColor.interactive.default.value,
    }),
    [theme.textColor.interactive]
  );

  const textColor = useMemo(
    () =>
      disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant],
    [disabled, textColors, theme.textColor.interactive.disabled.value, variant]
  );

  return (
    <React.Fragment>
      <Styled.Container
        onClick={onClick}
        $variant={variant}
        $size={size}
        disabled={disabled}
        $roundness={roundness}
        id={id}
        style={style}
      >
        <Icon variant={icon} size="xs" color={textColor} />
      </Styled.Container>
    </React.Fragment>
  );
};

export default ButtonIcon;

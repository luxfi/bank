'use client';

import React, { useMemo } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

import Icon from '../Icon';
import Styled from './styles';

import type { ICheckboxProps } from './types';
import { useTheme } from '../../providers/Theme';
import Text from '../Text';

const Checkbox: React.FC<ICheckboxProps> = ({
  checked = false,
  disabled,
  onChange,
  label,
  id,
  style,
}) => {
  const { theme } = useTheme();

  const textColor = useMemo(
    () =>
      disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.layout.primary.value,
    [
      disabled,
      theme.textColor.interactive.disabled.value,
      theme.textColor.layout.primary.value,
    ]
  );

  const iconColor = useMemo(
    () =>
      disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.interactive['default-inverse'].value,
    [disabled, theme.textColor.interactive]
  );

  return (
    <Styled.Container style={style}>
      <Styled.CheckboxContainer
        disabled={disabled}
        defaultChecked={checked}
        checked={checked}
        onCheckedChange={onChange}
        id={id || label}
      >
        <RadixCheckbox.Indicator>
          <Icon variant="check" color={iconColor} size="xs" />
        </RadixCheckbox.Indicator>
      </Styled.CheckboxContainer>

      {label && (
        <Text
          as="label"
          variant="body_sm_regular"
          color={textColor}
          htmlFor={id || label}
        >
          {label}
        </Text>
      )}
    </Styled.Container>
  );
};

export default React.memo(Checkbox);

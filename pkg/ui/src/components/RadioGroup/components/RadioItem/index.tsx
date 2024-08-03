import React from 'react';
import { useMemo } from 'react';

import { useTheme } from '../../../../providers/Theme';
import Text from '../../../Text';
import Styled from '../../styles';

import type { TRadioOption } from '../../types';

const RadioItem: React.FC<TRadioOption> = ({ disabled, label, value, id }) => {
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

  return (
    <Styled.ItemContainer key={value}>
      <Styled.Item value={value} id={id || value} disabled={disabled}>
        <Styled.Indicator />
      </Styled.Item>

      {label && (
        <Text
          variant="body_sm_regular"
          color={textColor}
          as="label"
          htmlFor={id || value}
        >
          {label}
        </Text>
      )}
    </Styled.ItemContainer>
  );
};

export default RadioItem;

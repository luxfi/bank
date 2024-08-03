import { IInputProps } from '../../types';
import Text from '../../../Text';
import React from 'react';
import { useTheme } from '../../../../providers/Theme';
import Styled from './styles';

const InputHelperText: React.FC<Partial<IInputProps>> = ({
  helperText,
  errorText,
  disabled,
}) => {
  const { theme } = useTheme();

  const errorHelperColor = React.useMemo(() => {
    if (disabled) return theme.textColor.interactive.disabled.value;
    if (errorText) return theme.textColor.feedback['text-negative'].value;
    return theme.textColor.layout.secondary.value;
  }, [
    disabled,
    errorText,
    theme.textColor.feedback,
    theme.textColor.interactive.disabled.value,
    theme.textColor.layout.secondary.value,
  ]);

  return (
    <Styled.InputHelperText>
      <Text variant="caption_regular" color={errorHelperColor}>
        {errorText || helperText}
      </Text>
    </Styled.InputHelperText>
  );
};

export default InputHelperText;

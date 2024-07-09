'use client';
import Styled from './styles';
import React, {
  ChangeEvent,
  FC,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import IMask, { FactoryArg } from 'imask';
import type { IControlledProps, IInputProps } from './types';
import Text from '../Text';
import InputHelperText from './components/InputHelperText';
import Icon from '../Icon';
import { useTheme } from '../../providers/Theme';
import { Controller } from 'react-hook-form';

const InputBase: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      label,
      leadingIcon,
      trailingIcon,
      inputMode,
      roundness = 'rounded',
      errorText,
      helperText,
      mask,
      defaultValue = '',
      onChangeText,
      rawValue,
      ...props
    },
    ref
  ) => {
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [value, setValue] = useState<string>(defaultValue);

    const { theme } = useTheme();

    const labelIconsColor = useMemo(() => {
      if (props.disabled) return theme.textColor.interactive.disabled.value;
      return theme.textColor.layout.secondary.value;
    }, [
      props.disabled,
      theme.textColor.interactive.disabled.value,
      theme.textColor.layout.secondary.value,
    ]);

    const length = useMemo(() => {
      if (typeof mask === 'string') return mask.length;
      return props.maxLength;
    }, [mask, props.maxLength]);

    const masked = useMemo(() => {
      const maskOptions: FactoryArg = mask ?? { mask: '' };
      return IMask.createMask(maskOptions);
    }, [mask]);

    const maskedValue = useCallback(
      (val?: string) => {
        if (!val || !mask) return val;
        masked.resolve(val);
        rawValue?.(masked.unmaskedValue);
        return masked.value;
      },
      [mask, masked, rawValue]
    );

    const handleOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChangeText?.(maskedValue(newValue) as string);
        setValue(newValue);
      },
      [maskedValue, onChangeText]
    );

    return (
      <Styled.Container>
        {label && (
          <Text
            variant="caption_regular"
            color={labelIconsColor}
            as="label"
            htmlFor={props.id || label}
          >
            {label}
          </Text>
        )}

        <Styled.InputWrapper>
          {leadingIcon && (
            <Styled.IconWrapper $leading>
              <Icon variant={leadingIcon} size="sm" color={labelIconsColor} />
            </Styled.IconWrapper>
          )}

          <Styled.Input
            ref={ref}
            id={props.id || label}
            $errorText={errorText}
            $leadingIcon={leadingIcon}
            $trailingIcon={trailingIcon}
            $inputMode={inputMode}
            $roundness={roundness}
            type={hidePassword ? inputMode : 'text'}
            value={maskedValue(value)}
            onChange={handleOnChange}
            maxLength={length}
            {...props}
          />

          {inputMode === 'password' && (
            <Styled.IconWrapper $inputMode="password">
              <Icon
                variant={hidePassword ? 'eye-closed' : 'eye'}
                size="sm"
                color={labelIconsColor}
                onClick={() => setHidePassword(!hidePassword)}
              />
            </Styled.IconWrapper>
          )}

          {trailingIcon && inputMode !== 'password' && (
            <Styled.IconWrapper>
              <Icon variant={trailingIcon} size="sm" color={labelIconsColor} />
            </Styled.IconWrapper>
          )}
        </Styled.InputWrapper>

        {(errorText || helperText) && (
          <InputHelperText
            helperText={helperText}
            errorText={errorText}
            {...props}
          />
        )}
      </Styled.Container>
    );
  }
);

const ControlledInput: FC<IControlledProps> = ({ control, name, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          errorText={error?.message}
          {...field}
          {...props}
          value={field.value ?? ''}
        />
      )}
    />
  );
};

const Input = InputBase as FC<IInputProps> & {
  Controlled: FC<IControlledProps>;
};
Input.Controlled = ControlledInput;

export default Input;

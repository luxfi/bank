'use client';

import * as RadixSelect from '@radix-ui/react-select';
import React from 'react';

import { useTheme } from '../../providers/Theme';

import Column from '../Column';
import Icon from '../Icon';
import Text from '../Text';
import Styled from './styles';
import type { ISelectProps, TSelectOptions } from './types';

const Select: React.FC<ISelectProps> = ({
  label,
  id,
  disabled,
  roundness = 'none',
  options,
  errorText,
  helperText,
  placeholder = 'Select',
  value,
  onChange,
  style,
}) => {
  const { theme } = useTheme();

  const errorHelperColor = React.useMemo(() => {
    if (disabled) {
      return theme.textColor.interactive.disabled.value;
    }

    return errorText
      ? theme.textColor.feedback['text-negative'].value
      : theme.textColor.layout.secondary.value;
  }, [
    disabled,
    errorText,
    theme.textColor.feedback,
    theme.textColor.interactive.disabled.value,
    theme.textColor.layout.secondary.value,
  ]);

  const labelIconsColor = React.useMemo(() => {
    if (disabled) {
      return theme.textColor.interactive.disabled.value;
    }

    return theme.textColor.interactive.enabled.value;
  }, [
    disabled,
    theme.textColor.interactive.disabled.value,
    theme.textColor.interactive.enabled.value,
  ]);

  const RenderLabel = React.useCallback(() => {
    if (!label) return null;

    return (
      <Text
        variant="caption_regular"
        color={labelIconsColor}
        as="label"
        htmlFor={id || label}
      >
        {label}
      </Text>
    );
  }, [id, label, labelIconsColor]);

  const RenderErrorHelperText = React.useCallback(() => {
    if (errorText || helperText) {
      return (
        <Styled.ErrorHelperContainer>
          <Text variant="caption_regular" color={errorHelperColor}>
            {errorText || helperText}
          </Text>
        </Styled.ErrorHelperContainer>
      );
    }
  }, [errorHelperColor, errorText, helperText]);

  const OptionLabel = React.useCallback(
    ({
      showExtraText,
      option,
    }: {
      showExtraText: boolean;
      option?: TSelectOptions;
    }) => {
      if (!option) return null;
      return (
        <Styled.ItemContainer>
          {option.icon && (
            <Styled.ItemCustomElement>
              <Icon variant={option.icon} size="sm" />
            </Styled.ItemCustomElement>
          )}
          {option.image && (
            <Styled.ItemCustomElement>
              <Styled.OptionImage src={option.image} />
            </Styled.ItemCustomElement>
          )}
          <Column gap="xxxs" margin="xxs">
            <Text
              variant="body_md_regular"
              color={theme.textColor.layout.secondary.value}
            >
              {option.label}
            </Text>
            {option.extraText && showExtraText && (
              <Text
                variant="caption_regular"
                color={theme.textColor.layout.secondary.value}
              >
                {option.extraText}
              </Text>
            )}
          </Column>
        </Styled.ItemContainer>
      );
    },
    [theme.textColor.layout.secondary.value]
  );

  return (
    <Styled.Container style={style}>
      <RenderLabel />

      <RadixSelect.Root
        disabled={disabled}
        onValueChange={onChange}
        value={value}
      >
        <Styled.Trigger
          $roundness={roundness}
          id={id || label}
          $errorText={errorText}
        >
          <RadixSelect.Value placeholder={placeholder}>
            <Styled.ItemTriggerContainer>
              <OptionLabel
                showExtraText={false}
                option={options.find((option) => option.value === value)}
              />
            </Styled.ItemTriggerContainer>
          </RadixSelect.Value>
          <RadixSelect.Icon>
            <Icon variant="alt-arrow-down" size="sm" />
          </RadixSelect.Icon>
        </Styled.Trigger>
        <RadixSelect.Portal>
          <Styled.Content position="popper" $roundness={roundness}>
            <RadixSelect.Viewport>
              {options.map((option) => (
                <Styled.Item
                  key={option.value}
                  value={option.value}
                  style={{
                    paddingBlock: option.extraText
                      ? theme.padding.sm.value
                      : theme.padding.xxs.value,
                  }}
                >
                  <RadixSelect.ItemText>
                    <OptionLabel showExtraText={true} option={option} />
                  </RadixSelect.ItemText>
                  <Styled.ItemIndicator>
                    <Icon variant="check" size="sm" />
                  </Styled.ItemIndicator>
                </Styled.Item>
              ))}
            </RadixSelect.Viewport>
          </Styled.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      <RenderErrorHelperText />
    </Styled.Container>
  );
};

export default Select;

'use client';
import * as RadixSelect from '@radix-ui/react-select';
import React from 'react';
import { useTheme } from '../../providers/Theme';
import Column from '../Column';
import Icon from '../Icon';
import Text from '../Text';
import Styled from './styles';
const Select = ({ label, id, disabled, roundness = 'none', options, errorText, helperText, placeholder = 'Select', value, onChange, style, }) => {
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
        if (!label)
            return null;
        return (React.createElement(Text, { variant: "caption_regular", color: labelIconsColor, as: "label", htmlFor: id || label }, label));
    }, [id, label, labelIconsColor]);
    const RenderErrorHelperText = React.useCallback(() => {
        if (errorText || helperText) {
            return (React.createElement(Styled.ErrorHelperContainer, null,
                React.createElement(Text, { variant: "caption_regular", color: errorHelperColor }, errorText || helperText)));
        }
    }, [errorHelperColor, errorText, helperText]);
    const OptionLabel = React.useCallback(({ showExtraText, option, }) => {
        if (!option)
            return null;
        return (React.createElement(Styled.ItemContainer, null,
            option.icon && (React.createElement(Styled.ItemCustomElement, null,
                React.createElement(Icon, { variant: option.icon, size: "sm" }))),
            option.image && (React.createElement(Styled.ItemCustomElement, null,
                React.createElement(Styled.OptionImage, { src: option.image }))),
            React.createElement(Column, { gap: "xxxs", margin: "xxs" },
                React.createElement(Text, { variant: "body_md_regular", color: theme.textColor.layout.secondary.value }, option.label),
                option.extraText && showExtraText && (React.createElement(Text, { variant: "caption_regular", color: theme.textColor.layout.secondary.value }, option.extraText)))));
    }, [theme.textColor.layout.secondary.value]);
    return (React.createElement(Styled.Container, { style: style },
        React.createElement(RenderLabel, null),
        React.createElement(RadixSelect.Root, { disabled: disabled, onValueChange: onChange, value: value },
            React.createElement(Styled.Trigger, { "$roundness": roundness, id: id || label, "$errorText": errorText },
                React.createElement(RadixSelect.Value, { placeholder: placeholder },
                    React.createElement(Styled.ItemTriggerContainer, null,
                        React.createElement(OptionLabel, { showExtraText: false, option: options.find((option) => option.value === value) }))),
                React.createElement(RadixSelect.Icon, null,
                    React.createElement(Icon, { variant: "alt-arrow-down", size: "sm" }))),
            React.createElement(RadixSelect.Portal, null,
                React.createElement(Styled.Content, { position: "popper", "$roundness": roundness },
                    React.createElement(RadixSelect.Viewport, null, options.map((option) => (React.createElement(Styled.Item, { key: option.value, value: option.value, style: {
                            paddingBlock: option.extraText
                                ? theme.padding.sm.value
                                : theme.padding.xxs.value,
                        } },
                        React.createElement(RadixSelect.ItemText, null,
                            React.createElement(OptionLabel, { showExtraText: true, option: option })),
                        React.createElement(Styled.ItemIndicator, null,
                            React.createElement(Icon, { variant: "check", size: "sm" }))))))))),
        React.createElement(RenderErrorHelperText, null)));
};
export default Select;
//# sourceMappingURL=index.js.map
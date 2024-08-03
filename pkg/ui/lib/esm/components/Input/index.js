'use client';
import Styled from './styles';
import React, { forwardRef, useCallback, useMemo, useState, } from 'react';
import IMask from 'imask';
import Text from '../Text';
import InputHelperText from './components/InputHelperText';
import Icon from '../Icon';
import { useTheme } from '../../providers/Theme';
import { Controller } from 'react-hook-form';
const InputBase = forwardRef(({ label, leadingIcon, trailingIcon, inputMode, roundness = 'rounded', errorText, helperText, mask, defaultValue = '', onChangeText, rawValue, ...props }, ref) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [value, setValue] = useState(defaultValue);
    const { theme } = useTheme();
    const labelIconsColor = useMemo(() => {
        if (props.disabled)
            return theme.textColor.interactive.disabled.value;
        return theme.textColor.layout.secondary.value;
    }, [
        props.disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    const length = useMemo(() => {
        if (typeof mask === 'string')
            return mask.length;
        return props.maxLength;
    }, [mask, props.maxLength]);
    const masked = useMemo(() => {
        const maskOptions = mask ?? { mask: '' };
        return IMask.createMask(maskOptions);
    }, [mask]);
    const maskedValue = useCallback((val) => {
        if (!val || !mask)
            return val;
        masked.resolve(val);
        rawValue?.(masked.unmaskedValue);
        return masked.value;
    }, [mask, masked, rawValue]);
    const handleOnChange = useCallback((e) => {
        const newValue = e.target.value;
        onChangeText?.(maskedValue(newValue));
        setValue(newValue);
    }, [maskedValue, onChangeText]);
    return (React.createElement(Styled.Container, null,
        label && (React.createElement(Text, { variant: "caption_regular", color: labelIconsColor, as: "label", htmlFor: props.id || label }, label)),
        React.createElement(Styled.InputWrapper, null,
            leadingIcon && (React.createElement(Styled.IconWrapper, { "$leading": true },
                React.createElement(Icon, { variant: leadingIcon, size: "sm", color: labelIconsColor }))),
            React.createElement(Styled.Input, { ref: ref, id: props.id || label, "$errorText": errorText, "$leadingIcon": leadingIcon, "$trailingIcon": trailingIcon, "$inputMode": inputMode, "$roundness": roundness, type: hidePassword ? inputMode : 'text', value: maskedValue(value), onChange: handleOnChange, maxLength: length, ...props }),
            inputMode === 'password' && (React.createElement(Styled.IconWrapper, { "$inputMode": "password" },
                React.createElement(Icon, { variant: hidePassword ? 'eye-closed' : 'eye', size: "sm", color: labelIconsColor, onClick: () => setHidePassword(!hidePassword) }))),
            trailingIcon && inputMode !== 'password' && (React.createElement(Styled.IconWrapper, null,
                React.createElement(Icon, { variant: trailingIcon, size: "sm", color: labelIconsColor })))),
        (errorText || helperText) && (React.createElement(InputHelperText, { helperText: helperText, errorText: errorText, ...props }))));
});
const ControlledInput = ({ control, name, ...props }) => {
    return (React.createElement(Controller, { name: name, control: control, render: ({ field, fieldState: { error } }) => (React.createElement(Input, { errorText: error?.message, ...field, ...props, value: field.value ?? '' })) }));
};
const Input = InputBase;
Input.Controlled = ControlledInput;
export default Input;
//# sourceMappingURL=index.js.map
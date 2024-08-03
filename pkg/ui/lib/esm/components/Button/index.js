'use client';
import React, { useMemo } from 'react';
import { useTheme } from '../../providers/Theme';
import Icon from '../Icon';
import Text from '../Text';
import Styled from './styles';
const Button = ({ variant = 'primary', size = 'default', text = 'Button', leftIcon, rightIcon, isLoading, roundness = 'rounded', fillContent = false, ...props }) => {
    const { theme } = useTheme();
    const textColors = useMemo(() => ({
        primary: theme.textColor.interactive['default-inverse'].value,
        secondary: theme.textColor.interactive.default.value,
        tertiary: theme.textColor.interactive.default.value,
        destructive: theme.textColor.layout['primary-inverse'].value,
    }), [theme.textColor.interactive, theme.textColor.layout]);
    const textColor = useMemo(() => props.disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant], [
        props.disabled,
        textColors,
        theme.textColor.interactive.disabled.value,
        variant,
    ]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Styled.Container, { "$variant": variant, "$size": size, "$roundness": roundness, "$fillContent": fillContent, "$isLoading": isLoading, ...props },
            isLoading && !rightIcon && leftIcon && React.createElement(Styled.LoadingAnimation, null),
            leftIcon && !isLoading && (React.createElement(Icon, { variant: leftIcon, size: size === 'default' ? 'sm' : 'xs', color: textColor })),
            React.createElement(Text, { textAlign: "center", variant: size === 'default' ? 'body_md_regular' : 'body_sm_regular', color: textColor }, text),
            isLoading && (!leftIcon || rightIcon) && React.createElement(Styled.LoadingAnimation, null),
            rightIcon && !isLoading && (React.createElement(Icon, { variant: rightIcon, size: size === 'default' ? 'sm' : 'xs', color: textColor })))));
};
export default Button;
//# sourceMappingURL=index.js.map
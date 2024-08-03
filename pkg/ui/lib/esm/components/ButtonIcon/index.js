'use client';
import React, { useMemo } from 'react';
import { useTheme } from '../../providers/Theme';
import Icon from '../Icon';
import Styled from './styles';
const ButtonIcon = ({ variant = 'primary', size = 'default', roundness = 'none', disabled = false, onClick = () => { }, icon, id, style, }) => {
    const { theme } = useTheme();
    const textColors = useMemo(() => ({
        primary: theme.textColor.interactive['default-inverse'].value,
        secondary: theme.textColor.interactive.default.value,
        tertiary: theme.textColor.interactive.default.value,
    }), [theme.textColor.interactive]);
    const textColor = useMemo(() => disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant], [disabled, textColors, theme.textColor.interactive.disabled.value, variant]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Styled.Container, { onClick: onClick, "$variant": variant, "$size": size, disabled: disabled, "$roundness": roundness, id: id, style: style },
            React.createElement(Icon, { variant: icon, size: "xs", color: textColor }))));
};
export default ButtonIcon;
//# sourceMappingURL=index.js.map
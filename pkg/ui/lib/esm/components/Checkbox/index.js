'use client';
import React, { useMemo } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import Icon from '../Icon';
import Styled from './styles';
import { useTheme } from '../../providers/Theme';
import Text from '../Text';
const Checkbox = ({ checked = false, disabled, onChange, label, id, style, }) => {
    const { theme } = useTheme();
    const textColor = useMemo(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.layout.primary.value, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.primary.value,
    ]);
    const iconColor = useMemo(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.interactive['default-inverse'].value, [disabled, theme.textColor.interactive]);
    return (React.createElement(Styled.Container, { style: style },
        React.createElement(Styled.CheckboxContainer, { disabled: disabled, defaultChecked: checked, checked: checked, onCheckedChange: onChange, id: id || label },
            React.createElement(RadixCheckbox.Indicator, null,
                React.createElement(Icon, { variant: "check", color: iconColor, size: "xs" }))),
        label && (React.createElement(Text, { as: "label", variant: "body_sm_regular", color: textColor, htmlFor: id || label }, label))));
};
export default React.memo(Checkbox);
//# sourceMappingURL=index.js.map
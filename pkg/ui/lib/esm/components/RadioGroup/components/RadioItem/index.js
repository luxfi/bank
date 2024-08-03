import React from 'react';
import { useMemo } from 'react';
import { useTheme } from '../../../../providers/Theme';
import Text from '../../../Text';
import Styled from '../../styles';
const RadioItem = ({ disabled, label, value, id }) => {
    const { theme } = useTheme();
    const textColor = useMemo(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.layout.primary.value, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.primary.value,
    ]);
    return (React.createElement(Styled.ItemContainer, { key: value },
        React.createElement(Styled.Item, { value: value, id: id || value, disabled: disabled },
            React.createElement(Styled.Indicator, null)),
        label && (React.createElement(Text, { variant: "body_sm_regular", color: textColor, as: "label", htmlFor: id || value }, label))));
};
export default RadioItem;
//# sourceMappingURL=index.js.map
import Text from '../../../Text';
import React from 'react';
import { useTheme } from '../../../../providers/Theme';
import Styled from './styles';
const InputHelperText = ({ helperText, errorText, disabled, }) => {
    const { theme } = useTheme();
    const errorHelperColor = React.useMemo(() => {
        if (disabled)
            return theme.textColor.interactive.disabled.value;
        if (errorText)
            return theme.textColor.feedback['text-negative'].value;
        return theme.textColor.layout.secondary.value;
    }, [
        disabled,
        errorText,
        theme.textColor.feedback,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    return (React.createElement(Styled.InputHelperText, null,
        React.createElement(Text, { variant: "caption_regular", color: errorHelperColor }, errorText || helperText)));
};
export default InputHelperText;
//# sourceMappingURL=index.js.map
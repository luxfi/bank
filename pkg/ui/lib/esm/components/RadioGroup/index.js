'use client';
import React, { useCallback } from 'react';
import RadioItem from './components/RadioItem';
import Styled from './styles';
const RadioGroup = ({ onChange, options, value, style, }) => {
    const RenderOptions = useCallback(() => options.map(RadioItem), [options]);
    return (React.createElement(Styled.Root, { value: value, onValueChange: onChange, style: style },
        React.createElement(RenderOptions, null)));
};
export default RadioGroup;
//# sourceMappingURL=index.js.map
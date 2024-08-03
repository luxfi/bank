'use client';
import React from 'react';
import Styled from './styles';
const Column = ({ children, justify = 'flex-start', align = 'flex-start', gap, padding, margin, width, height, wrap = 'nowrap', style, }) => {
    return (React.createElement(Styled.Container, { "$justify": justify, "$align": align, "$gap": gap, "$padding": padding, "$margin": margin, "$wrap": wrap, "$width": width, "$height": height, style: style }, children));
};
export default Column;
//# sourceMappingURL=index.js.map
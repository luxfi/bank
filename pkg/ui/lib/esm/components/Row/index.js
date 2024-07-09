'use client';
import React from 'react';
import Styled from './styles';
const Row = ({ children, justify = 'flex-start', align = 'flex-start', gap, padding, margin, width, height, wrap = 'nowrap', style, }) => {
    return (React.createElement(Styled.Container, { "$justify": justify, "$align": align, "$gap": gap, "$padding": padding, "$margin": margin, "$wrap": wrap, "$width": width, "$height": height, style: style }, children));
};
export default Row;
//# sourceMappingURL=index.js.map
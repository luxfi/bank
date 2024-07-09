'use client';
import React from 'react';
import Styled from './styles';
const Layout = ({ children, fillContent, direction = 'row', justify = 'flex-start', align = 'flex-start', gap, rowGap, columnGap, gridRowGap, gridColumnGap, padding, margin, wrap = direction === 'row' ? 'wrap' : 'nowrap', backgroundColor, width, height, style, }) => {
    return (React.createElement(Styled.Container, { "$fillContent": fillContent, "$direction": direction, "$justify": justify, "$align": align, "$gap": gap, "$rowGap": rowGap, "$columnGap": columnGap, "$gridRowGap": gridRowGap, "$gridColumnGap": gridColumnGap, "$padding": padding, "$margin": margin, "$wrap": wrap, "$backgroundColor": backgroundColor, "$width": width, "$height": height, style: style }, children));
};
export default Layout;
//# sourceMappingURL=index.js.map
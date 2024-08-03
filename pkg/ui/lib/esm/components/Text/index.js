'use client';
import React from 'react';
import Styled from './styles';
const Text = ({ children, variant, color, href, target, textAlign = 'left', as = 'p', htmlFor, id, style, }) => {
    if (href) {
        return (React.createElement(Styled.TextLink, { "$variant": variant, "$color": color, "$textAlign": textAlign, href: href, target: target, id: id, style: style }, children));
    }
    return (React.createElement(Styled.Text, { as: as, "$variant": variant, "$textAlign": textAlign, "$color": color, htmlFor: htmlFor, id: id, style: style }, children));
};
export default Text;
//# sourceMappingURL=index.js.map
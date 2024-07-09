'use client';
import React from 'react';
import Styled from './styles';
const Card = ({ children, align, backgroundColor, borderRadius, borderWidth, borderColor, shadow, padding, direction, gap, height, id, justify, margin, width, maxWidth, maxHeight, minHeight, minWidth, overflow, wrap, style, }) => {
    return (React.createElement(Styled.Container, { "$align": align, "$backgroundColor": backgroundColor, "$borderRadius": borderRadius, "$borderWidth": borderWidth, "$borderColor": borderColor, "$shadow": shadow, "$padding": padding, "$direction": direction, "$gap": gap, "$height": height, "$id": id, "$justify": justify, "$margin": margin, "$width": width, "$overflow": overflow, "$wrap": wrap, "$minHeight": minHeight, "$minWidth": minWidth, "$maxHeight": maxHeight, "$maxWidth": maxWidth, style: style }, children));
};
export default Card;
//# sourceMappingURL=index.js.map
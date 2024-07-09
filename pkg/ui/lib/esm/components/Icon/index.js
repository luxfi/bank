'use client';
import React, { useMemo } from 'react';
import icoMoonConfig from '../../styles/fonts/ds-icons.json';
import Styled from './styles';
const Icon = ({ variant, size = 'md', color, onClick, style, }) => {
    const iconCode = useMemo(() => icoMoonConfig.icons.find((i) => i.properties?.name.toLowerCase() === variant)?.properties?.code, [variant]);
    return (React.createElement(Styled.Container, { "$size": size, "$color": color, onClick: onClick, style: style }, iconCode ? String.fromCodePoint(iconCode) : '?'));
};
export default Icon;
//# sourceMappingURL=index.js.map
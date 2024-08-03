'use client';
import React from 'react';
import { ThemeProvider as StyledThemeProvider, } from 'styled-components';
import theme from '../../styles/theme';
const ThemeContext = React.createContext({
    theme: theme.light,
    setTheme: () => { },
});
export const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
const ThemeProvider = ({ children, defaultTheme, }) => {
    const [activeTheme, setActiveTheme] = React.useState(defaultTheme ?? theme.light);
    const setTheme = (_theme) => {
        setActiveTheme(_theme);
    };
    return (React.createElement(ThemeContext.Provider, { value: { theme: activeTheme, setTheme } },
        React.createElement(StyledThemeProvider, { theme: activeTheme }, children)));
};
export default ThemeProvider;
//# sourceMappingURL=index.js.map
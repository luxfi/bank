'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTheme = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = require("styled-components");
const theme_1 = __importDefault(require("../../styles/theme"));
const ThemeContext = react_1.default.createContext({
    theme: theme_1.default.light,
    setTheme: () => { },
});
const useTheme = () => {
    const context = react_1.default.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
exports.useTheme = useTheme;
const ThemeProvider = ({ children, defaultTheme, }) => {
    const [activeTheme, setActiveTheme] = react_1.default.useState(defaultTheme ?? theme_1.default.light);
    const setTheme = (_theme) => {
        setActiveTheme(_theme);
    };
    return (react_1.default.createElement(ThemeContext.Provider, { value: { theme: activeTheme, setTheme } },
        react_1.default.createElement(styled_components_1.ThemeProvider, { theme: activeTheme }, children)));
};
exports.default = ThemeProvider;
//# sourceMappingURL=index.js.map
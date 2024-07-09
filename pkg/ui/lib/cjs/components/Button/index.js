'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Theme_1 = require("../../providers/Theme");
const Icon_1 = __importDefault(require("../Icon"));
const Text_1 = __importDefault(require("../Text"));
const styles_1 = __importDefault(require("./styles"));
const Button = ({ variant = 'primary', size = 'default', text = 'Button', leftIcon, rightIcon, isLoading, roundness = 'rounded', fillContent = false, ...props }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const textColors = (0, react_1.useMemo)(() => ({
        primary: theme.textColor.interactive['default-inverse'].value,
        secondary: theme.textColor.interactive.default.value,
        tertiary: theme.textColor.interactive.default.value,
        destructive: theme.textColor.layout['primary-inverse'].value,
    }), [theme.textColor.interactive, theme.textColor.layout]);
    const textColor = (0, react_1.useMemo)(() => props.disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant], [
        props.disabled,
        textColors,
        theme.textColor.interactive.disabled.value,
        variant,
    ]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(styles_1.default.Container, { "$variant": variant, "$size": size, "$roundness": roundness, "$fillContent": fillContent, "$isLoading": isLoading, ...props },
            isLoading && !rightIcon && leftIcon && react_1.default.createElement(styles_1.default.LoadingAnimation, null),
            leftIcon && !isLoading && (react_1.default.createElement(Icon_1.default, { variant: leftIcon, size: size === 'default' ? 'sm' : 'xs', color: textColor })),
            react_1.default.createElement(Text_1.default, { textAlign: "center", variant: size === 'default' ? 'body_md_regular' : 'body_sm_regular', color: textColor }, text),
            isLoading && (!leftIcon || rightIcon) && react_1.default.createElement(styles_1.default.LoadingAnimation, null),
            rightIcon && !isLoading && (react_1.default.createElement(Icon_1.default, { variant: rightIcon, size: size === 'default' ? 'sm' : 'xs', color: textColor })))));
};
exports.default = Button;
//# sourceMappingURL=index.js.map
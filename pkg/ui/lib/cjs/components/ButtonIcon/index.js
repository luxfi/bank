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
const styles_1 = __importDefault(require("./styles"));
const ButtonIcon = ({ variant = 'primary', size = 'default', roundness = 'none', disabled = false, onClick = () => { }, icon, id, style, }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const textColors = (0, react_1.useMemo)(() => ({
        primary: theme.textColor.interactive['default-inverse'].value,
        secondary: theme.textColor.interactive.default.value,
        tertiary: theme.textColor.interactive.default.value,
    }), [theme.textColor.interactive]);
    const textColor = (0, react_1.useMemo)(() => disabled
        ? theme.textColor.interactive.disabled.value
        : textColors[variant], [disabled, textColors, theme.textColor.interactive.disabled.value, variant]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(styles_1.default.Container, { onClick: onClick, "$variant": variant, "$size": size, disabled: disabled, "$roundness": roundness, id: id, style: style },
            react_1.default.createElement(Icon_1.default, { variant: icon, size: "xs", color: textColor }))));
};
exports.default = ButtonIcon;
//# sourceMappingURL=index.js.map
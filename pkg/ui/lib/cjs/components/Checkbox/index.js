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
const RadixCheckbox = __importStar(require("@radix-ui/react-checkbox"));
const Icon_1 = __importDefault(require("../Icon"));
const styles_1 = __importDefault(require("./styles"));
const Theme_1 = require("../../providers/Theme");
const Text_1 = __importDefault(require("../Text"));
const Checkbox = ({ checked = false, disabled, onChange, label, id, style, }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const textColor = (0, react_1.useMemo)(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.layout.primary.value, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.primary.value,
    ]);
    const iconColor = (0, react_1.useMemo)(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.interactive['default-inverse'].value, [disabled, theme.textColor.interactive]);
    return (react_1.default.createElement(styles_1.default.Container, { style: style },
        react_1.default.createElement(styles_1.default.CheckboxContainer, { disabled: disabled, defaultChecked: checked, checked: checked, onCheckedChange: onChange, id: id || label },
            react_1.default.createElement(RadixCheckbox.Indicator, null,
                react_1.default.createElement(Icon_1.default, { variant: "check", color: iconColor, size: "xs" }))),
        label && (react_1.default.createElement(Text_1.default, { as: "label", variant: "body_sm_regular", color: textColor, htmlFor: id || label }, label))));
};
exports.default = react_1.default.memo(Checkbox);
//# sourceMappingURL=index.js.map
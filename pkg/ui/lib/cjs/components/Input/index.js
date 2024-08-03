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
const styles_1 = __importDefault(require("./styles"));
const react_1 = __importStar(require("react"));
const imask_1 = __importDefault(require("imask"));
const Text_1 = __importDefault(require("../Text"));
const InputHelperText_1 = __importDefault(require("./components/InputHelperText"));
const Icon_1 = __importDefault(require("../Icon"));
const Theme_1 = require("../../providers/Theme");
const react_hook_form_1 = require("react-hook-form");
const InputBase = (0, react_1.forwardRef)(({ label, leadingIcon, trailingIcon, inputMode, roundness = 'rounded', errorText, helperText, mask, defaultValue = '', onChangeText, rawValue, ...props }, ref) => {
    const [hidePassword, setHidePassword] = (0, react_1.useState)(true);
    const [value, setValue] = (0, react_1.useState)(defaultValue);
    const { theme } = (0, Theme_1.useTheme)();
    const labelIconsColor = (0, react_1.useMemo)(() => {
        if (props.disabled)
            return theme.textColor.interactive.disabled.value;
        return theme.textColor.layout.secondary.value;
    }, [
        props.disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    const length = (0, react_1.useMemo)(() => {
        if (typeof mask === 'string')
            return mask.length;
        return props.maxLength;
    }, [mask, props.maxLength]);
    const masked = (0, react_1.useMemo)(() => {
        const maskOptions = mask ?? { mask: '' };
        return imask_1.default.createMask(maskOptions);
    }, [mask]);
    const maskedValue = (0, react_1.useCallback)((val) => {
        if (!val || !mask)
            return val;
        masked.resolve(val);
        rawValue?.(masked.unmaskedValue);
        return masked.value;
    }, [mask, masked, rawValue]);
    const handleOnChange = (0, react_1.useCallback)((e) => {
        const newValue = e.target.value;
        onChangeText?.(maskedValue(newValue));
        setValue(newValue);
    }, [maskedValue, onChangeText]);
    return (react_1.default.createElement(styles_1.default.Container, null,
        label && (react_1.default.createElement(Text_1.default, { variant: "caption_regular", color: labelIconsColor, as: "label", htmlFor: props.id || label }, label)),
        react_1.default.createElement(styles_1.default.InputWrapper, null,
            leadingIcon && (react_1.default.createElement(styles_1.default.IconWrapper, { "$leading": true },
                react_1.default.createElement(Icon_1.default, { variant: leadingIcon, size: "sm", color: labelIconsColor }))),
            react_1.default.createElement(styles_1.default.Input, { ref: ref, id: props.id || label, "$errorText": errorText, "$leadingIcon": leadingIcon, "$trailingIcon": trailingIcon, "$inputMode": inputMode, "$roundness": roundness, type: hidePassword ? inputMode : 'text', value: maskedValue(value), onChange: handleOnChange, maxLength: length, ...props }),
            inputMode === 'password' && (react_1.default.createElement(styles_1.default.IconWrapper, { "$inputMode": "password" },
                react_1.default.createElement(Icon_1.default, { variant: hidePassword ? 'eye-closed' : 'eye', size: "sm", color: labelIconsColor, onClick: () => setHidePassword(!hidePassword) }))),
            trailingIcon && inputMode !== 'password' && (react_1.default.createElement(styles_1.default.IconWrapper, null,
                react_1.default.createElement(Icon_1.default, { variant: trailingIcon, size: "sm", color: labelIconsColor })))),
        (errorText || helperText) && (react_1.default.createElement(InputHelperText_1.default, { helperText: helperText, errorText: errorText, ...props }))));
});
const ControlledInput = ({ control, name, ...props }) => {
    return (react_1.default.createElement(react_hook_form_1.Controller, { name: name, control: control, render: ({ field, fieldState: { error } }) => (react_1.default.createElement(Input, { errorText: error?.message, ...field, ...props, value: field.value ?? '' })) }));
};
const Input = InputBase;
Input.Controlled = ControlledInput;
exports.default = Input;
//# sourceMappingURL=index.js.map
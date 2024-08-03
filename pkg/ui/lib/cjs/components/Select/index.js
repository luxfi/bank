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
const RadixSelect = __importStar(require("@radix-ui/react-select"));
const react_1 = __importDefault(require("react"));
const Theme_1 = require("../../providers/Theme");
const Column_1 = __importDefault(require("../Column"));
const Icon_1 = __importDefault(require("../Icon"));
const Text_1 = __importDefault(require("../Text"));
const styles_1 = __importDefault(require("./styles"));
const Select = ({ label, id, disabled, roundness = 'none', options, errorText, helperText, placeholder = 'Select', value, onChange, style, }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const errorHelperColor = react_1.default.useMemo(() => {
        if (disabled) {
            return theme.textColor.interactive.disabled.value;
        }
        return errorText
            ? theme.textColor.feedback['text-negative'].value
            : theme.textColor.layout.secondary.value;
    }, [
        disabled,
        errorText,
        theme.textColor.feedback,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    const labelIconsColor = react_1.default.useMemo(() => {
        if (disabled) {
            return theme.textColor.interactive.disabled.value;
        }
        return theme.textColor.interactive.enabled.value;
    }, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.interactive.enabled.value,
    ]);
    const RenderLabel = react_1.default.useCallback(() => {
        if (!label)
            return null;
        return (react_1.default.createElement(Text_1.default, { variant: "caption_regular", color: labelIconsColor, as: "label", htmlFor: id || label }, label));
    }, [id, label, labelIconsColor]);
    const RenderErrorHelperText = react_1.default.useCallback(() => {
        if (errorText || helperText) {
            return (react_1.default.createElement(styles_1.default.ErrorHelperContainer, null,
                react_1.default.createElement(Text_1.default, { variant: "caption_regular", color: errorHelperColor }, errorText || helperText)));
        }
    }, [errorHelperColor, errorText, helperText]);
    const OptionLabel = react_1.default.useCallback(({ showExtraText, option, }) => {
        if (!option)
            return null;
        return (react_1.default.createElement(styles_1.default.ItemContainer, null,
            option.icon && (react_1.default.createElement(styles_1.default.ItemCustomElement, null,
                react_1.default.createElement(Icon_1.default, { variant: option.icon, size: "sm" }))),
            option.image && (react_1.default.createElement(styles_1.default.ItemCustomElement, null,
                react_1.default.createElement(styles_1.default.OptionImage, { src: option.image }))),
            react_1.default.createElement(Column_1.default, { gap: "xxxs", margin: "xxs" },
                react_1.default.createElement(Text_1.default, { variant: "body_md_regular", color: theme.textColor.layout.secondary.value }, option.label),
                option.extraText && showExtraText && (react_1.default.createElement(Text_1.default, { variant: "caption_regular", color: theme.textColor.layout.secondary.value }, option.extraText)))));
    }, [theme.textColor.layout.secondary.value]);
    return (react_1.default.createElement(styles_1.default.Container, { style: style },
        react_1.default.createElement(RenderLabel, null),
        react_1.default.createElement(RadixSelect.Root, { disabled: disabled, onValueChange: onChange, value: value },
            react_1.default.createElement(styles_1.default.Trigger, { "$roundness": roundness, id: id || label, "$errorText": errorText },
                react_1.default.createElement(RadixSelect.Value, { placeholder: placeholder },
                    react_1.default.createElement(styles_1.default.ItemTriggerContainer, null,
                        react_1.default.createElement(OptionLabel, { showExtraText: false, option: options.find((option) => option.value === value) }))),
                react_1.default.createElement(RadixSelect.Icon, null,
                    react_1.default.createElement(Icon_1.default, { variant: "alt-arrow-down", size: "sm" }))),
            react_1.default.createElement(RadixSelect.Portal, null,
                react_1.default.createElement(styles_1.default.Content, { position: "popper", "$roundness": roundness },
                    react_1.default.createElement(RadixSelect.Viewport, null, options.map((option) => (react_1.default.createElement(styles_1.default.Item, { key: option.value, value: option.value, style: {
                            paddingBlock: option.extraText
                                ? theme.padding.sm.value
                                : theme.padding.xxs.value,
                        } },
                        react_1.default.createElement(RadixSelect.ItemText, null,
                            react_1.default.createElement(OptionLabel, { showExtraText: true, option: option })),
                        react_1.default.createElement(styles_1.default.ItemIndicator, null,
                            react_1.default.createElement(Icon_1.default, { variant: "check", size: "sm" }))))))))),
        react_1.default.createElement(RenderErrorHelperText, null)));
};
exports.default = Select;
//# sourceMappingURL=index.js.map
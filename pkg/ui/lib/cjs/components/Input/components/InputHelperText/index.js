"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Text_1 = __importDefault(require("../../../Text"));
const react_1 = __importDefault(require("react"));
const Theme_1 = require("../../../../providers/Theme");
const styles_1 = __importDefault(require("./styles"));
const InputHelperText = ({ helperText, errorText, disabled, }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const errorHelperColor = react_1.default.useMemo(() => {
        if (disabled)
            return theme.textColor.interactive.disabled.value;
        if (errorText)
            return theme.textColor.feedback['text-negative'].value;
        return theme.textColor.layout.secondary.value;
    }, [
        disabled,
        errorText,
        theme.textColor.feedback,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    return (react_1.default.createElement(styles_1.default.InputHelperText, null,
        react_1.default.createElement(Text_1.default, { variant: "caption_regular", color: errorHelperColor }, errorText || helperText)));
};
exports.default = InputHelperText;
//# sourceMappingURL=index.js.map
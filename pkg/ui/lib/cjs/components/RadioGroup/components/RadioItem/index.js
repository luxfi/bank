"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const Theme_1 = require("../../../../providers/Theme");
const Text_1 = __importDefault(require("../../../Text"));
const styles_1 = __importDefault(require("../../styles"));
const RadioItem = ({ disabled, label, value, id }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const textColor = (0, react_2.useMemo)(() => disabled
        ? theme.textColor.interactive.disabled.value
        : theme.textColor.layout.primary.value, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.primary.value,
    ]);
    return (react_1.default.createElement(styles_1.default.ItemContainer, { key: value },
        react_1.default.createElement(styles_1.default.Item, { value: value, id: id || value, disabled: disabled },
            react_1.default.createElement(styles_1.default.Indicator, null)),
        label && (react_1.default.createElement(Text_1.default, { variant: "body_sm_regular", color: textColor, as: "label", htmlFor: id || value }, label))));
};
exports.default = RadioItem;
//# sourceMappingURL=index.js.map
'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = __importDefault(require("./styles"));
const Text = ({ children, variant, color, href, target, textAlign = 'left', as = 'p', htmlFor, id, style, }) => {
    if (href) {
        return (react_1.default.createElement(styles_1.default.TextLink, { "$variant": variant, "$color": color, "$textAlign": textAlign, href: href, target: target, id: id, style: style }, children));
    }
    return (react_1.default.createElement(styles_1.default.Text, { as: as, "$variant": variant, "$textAlign": textAlign, "$color": color, htmlFor: htmlFor, id: id, style: style }, children));
};
exports.default = Text;
//# sourceMappingURL=index.js.map
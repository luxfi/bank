'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = __importDefault(require("./styles"));
const Layout = ({ children, fillContent, direction = 'row', justify = 'flex-start', align = 'flex-start', gap, rowGap, columnGap, gridRowGap, gridColumnGap, padding, margin, wrap = direction === 'row' ? 'wrap' : 'nowrap', backgroundColor, width, height, style, }) => {
    return (react_1.default.createElement(styles_1.default.Container, { "$fillContent": fillContent, "$direction": direction, "$justify": justify, "$align": align, "$gap": gap, "$rowGap": rowGap, "$columnGap": columnGap, "$gridRowGap": gridRowGap, "$gridColumnGap": gridColumnGap, "$padding": padding, "$margin": margin, "$wrap": wrap, "$backgroundColor": backgroundColor, "$width": width, "$height": height, style: style }, children));
};
exports.default = Layout;
//# sourceMappingURL=index.js.map
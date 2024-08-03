'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = __importDefault(require("./styles"));
const Column = ({ children, justify = 'flex-start', align = 'flex-start', gap, padding, margin, width, height, wrap = 'nowrap', style, }) => {
    return (react_1.default.createElement(styles_1.default.Container, { "$justify": justify, "$align": align, "$gap": gap, "$padding": padding, "$margin": margin, "$wrap": wrap, "$width": width, "$height": height, style: style }, children));
};
exports.default = Column;
//# sourceMappingURL=index.js.map
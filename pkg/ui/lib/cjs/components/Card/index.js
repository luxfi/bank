'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = __importDefault(require("./styles"));
const Card = ({ children, align, backgroundColor, borderRadius, borderWidth, borderColor, shadow, padding, direction, gap, height, id, justify, margin, width, maxWidth, maxHeight, minHeight, minWidth, overflow, wrap, style, }) => {
    return (react_1.default.createElement(styles_1.default.Container, { "$align": align, "$backgroundColor": backgroundColor, "$borderRadius": borderRadius, "$borderWidth": borderWidth, "$borderColor": borderColor, "$shadow": shadow, "$padding": padding, "$direction": direction, "$gap": gap, "$height": height, "$id": id, "$justify": justify, "$margin": margin, "$width": width, "$overflow": overflow, "$wrap": wrap, "$minHeight": minHeight, "$minWidth": minWidth, "$maxHeight": maxHeight, "$maxWidth": maxWidth, style: style }, children));
};
exports.default = Card;
//# sourceMappingURL=index.js.map
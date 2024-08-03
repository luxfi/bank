"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const Container = styled_components_1.default.div `
  display: flex;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  justify-content: ${({ $justify }) => $justify};
  align-items: ${({ $align }) => $align};
  flex-direction: column;
  flex-wrap: ${({ $wrap }) => $wrap};
  gap: ${({ $gap, theme }) => ($gap ? theme.gap[$gap]?.value : undefined)};
  padding: ${({ $padding, theme }) => ($padding ? theme.padding[$padding]?.value : undefined)};
  margin: ${({ $margin, theme }) => ($margin ? theme.margin[$margin]?.value : undefined)};
`;
exports.default = {
    Container,
};
//# sourceMappingURL=styles.js.map
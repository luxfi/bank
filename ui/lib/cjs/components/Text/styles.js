"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const constants_1 = require("./constants");
const Text = styled_components_1.default.p `
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => constants_1.variants[$variant]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;
const TextLink = styled_components_1.default.a `
  width: fit-content;
  margin: 0;
  padding: 0;
  ${({ $variant }) => constants_1.variants[$variant]};
  color: ${({ theme, $color }) => $color || theme.textColor.layout.primary.value};
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
`;
exports.default = {
    Text,
    TextLink,
};
//# sourceMappingURL=styles.js.map
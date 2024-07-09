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
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importStar(require("styled-components"));
const sizes = {
    xxs: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.xs.value};
    line-height: ${({ theme }) => theme.height.xs.value};
  `,
    xs: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.sm.value};
    line-height: ${({ theme }) => theme.height.sm.value};
  `,
    sm: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.md.value};
    line-height: ${({ theme }) => theme.height.md.value};
  `,
    md: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.lg.value};
    line-height: ${({ theme }) => theme.height.lg.value};
  `,
    lg: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.xxl.value};
    line-height: ${({ theme }) => theme.height.xxl.value};
  `,
    xl: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height.xxxl.value};
    line-height: ${({ theme }) => theme.height.xxxl.value};
  `,
    xxl: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height['24x'].value};
    line-height: ${({ theme }) => theme.height['24x'].value};
  `,
    xxxl: (0, styled_components_1.css) `
    font-size: ${({ theme }) => theme.height['30x'].value};
    line-height: ${({ theme }) => theme.height['30x'].value};
  `,
};
const Container = styled_components_1.default.span `
  width: fit-content;
  font-family: var(--ds-icons);
  font-weight: 100;
  color: ${(props) => props.$color || props.theme.textColor.layout.primary.value};
  ${(props) => sizes[props.$size || 'md']};
`;
exports.default = {
    Container,
};
//# sourceMappingURL=styles.js.map
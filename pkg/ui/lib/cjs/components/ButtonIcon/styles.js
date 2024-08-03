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
const variants = {
    primary: (0, styled_components_1.css) `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-press'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
    }
  `,
    secondary: (0, styled_components_1.css) `
    border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
    border-style: solid;
    border-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
    background-color: ${({ theme }) => theme.backgroundColor.interactive.transparent.value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-hover'].value};
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-press'].value};
    }
    &:disabled {
      border: none;
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-disabled'].value};
    }
  `,
    tertiary: (0, styled_components_1.css) `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive.transparent.value};
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['tertiary-hover'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['tertiary-disabled'].value};
    }
  `,
};
const sizes = {
    default: (0, styled_components_1.css) `
    padding-top: ${({ theme }) => theme.padding.xs.value};
    padding-bottom: ${({ theme }) => theme.padding.xs.value};
    padding-left: ${({ theme }) => theme.padding.xs.value};
    padding-right: ${({ theme }) => theme.padding.xs.value};
  `,
    small: (0, styled_components_1.css) `
    padding-top: ${({ theme }) => theme.padding.xxxs.value};
    padding-bottom: ${({ theme }) => theme.padding.xxxs.value};
    padding-left: ${({ theme }) => theme.padding.xxxs.value};
    padding-right: ${({ theme }) => theme.padding.xxxs.value};
  `,
};
const roundness = {
    none: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  `,
    rounded: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
    pill: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  `,
};
const Container = styled_components_1.default.button `
  all: unset;

  cursor: pointer;

  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: background-color 0.3s ease;
  gap: ${({ theme }) => theme.gap.xxs.value};

  ${(props) => variants[props.$variant || 'primary']};
  ${(props) => sizes[props.$size || 'default']};
  ${(props) => roundness[props.$roundness || 'none']};

  p {
    margin: 0px;
  }
`;
exports.default = {
    Container,
};
//# sourceMappingURL=styles.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importStar(require("styled-components"));
const Text_1 = __importDefault(require("../Text"));
const variants = {
    primary: (0, styled_components_1.css) `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
    &:hover {
      background: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value}
        radial-gradient(
          circle,
          transparent 1%,
          ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value} 1%
        )
        center/15000%;
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-press'].value};
      background-size: 100%;
      transition: background 0s;
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
      background: ${({ theme }) => theme.backgroundColor.interactive['secondary-hover'].value}
        radial-gradient(
          circle,
          transparent 1%,
          ${({ theme }) => theme.backgroundColor.interactive['secondary-hover'].value} 1%
        )
        center/15000%;
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['secondary-press'].value};
      background-size: 100%;
      transition: background 0s;
    }
    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive.disabled.value};
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
    destructive: (0, styled_components_1.css) `
    border: none;
    background-color: ${({ theme }) => theme.backgroundColor.interactive['destructive-default'].value};
    &:hover {
      background: ${({ theme }) => theme.backgroundColor.interactive['destructive-hover'].value}
        radial-gradient(
          circle,
          transparent 1%,
          ${({ theme }) => theme.backgroundColor.interactive['destructive-hover'].value} 1%
        )
        center/15000%;
    }
    &:active {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['destructive-press'].value};
      background-size: 100%;
      transition: background 0s;
    }
    &:disabled {
      border: none;
      background-color: ${({ theme }) => theme.backgroundColor.interactive['destructive-disabled'].value};
    }
  `,
};
const sizes = {
    default: (0, styled_components_1.css) `
    height: ${({ theme }) => theme.height.xl.value};
    padding-top: ${({ theme }) => theme.padding.xxs.value};
    padding-bottom: ${({ theme }) => theme.padding.xxs.value};
    padding-left: ${({ theme }) => theme.padding.lg.value};
    padding-right: ${({ theme }) => theme.padding.lg.value};
  `,
    small: (0, styled_components_1.css) `
    height: 28px;
    padding-top: ${({ theme }) => theme.padding.xxxs.value};
    padding-bottom: ${({ theme }) => theme.padding.xxxs.value};
    padding-left: ${({ theme }) => theme.padding.lg.value};
    padding-right: ${({ theme }) => theme.padding.lg.value};
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
  box-sizing: border-box;

  width: ${(props) => (props.$fillContent ? '100%' : 'fit-content')};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.gap.xxs.value};

  /* for ripple effect */
  background-position: center;
  transition: background 0.8s;

  ${(props) => variants[props.$variant || 'primary']};
  ${(props) => sizes[props.$size || 'default']};
  ${(props) => roundness[props.$roundness || 'none']};
  justify-content: center;

  &&${Text_1.default.prototype} {
    white-space: nowrap;
  }

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) => props.$isLoading &&
    (0, styled_components_1.css) `
      cursor: default;
      pointer-events: none;
      border-color: ${({ theme }) => (props.$variant ? theme.borderColor.interactive.disabled.value : 'none')};
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
      & p {
        color: ${({ theme }) => theme.textColor.interactive.disabled.value};
      }
    `};
`;
const LoadingAnimation = styled_components_1.default.div `
  position: relative;
  width: 16px;
  height: 16px;
  background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: inherit;
  }

  &::before {
    top: 7px;
    left: 7px;
    width: 2px;
    height: 2px;
    background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
    opacity: 0.8;
    animation: pulse 3s ease-out infinite;
  }

  &::after {
    top: 1px;
    left: 1px;
    width: 11px;
    height: 11px;
    border: 1.5px solid transparent;
    border-top: 1.5px solid;
    border-top-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
    animation: spin 1s linear infinite;
  }

  @keyframes pulse {
    100% {
      opacity: 0;
      transform: scale(8);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
exports.default = { Container, LoadingAnimation };
//# sourceMappingURL=styles.js.map
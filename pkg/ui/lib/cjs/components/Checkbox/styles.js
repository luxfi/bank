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
const styled_components_1 = __importDefault(require("styled-components"));
const RadixCheckbox = __importStar(require("@radix-ui/react-checkbox"));
const Icon_1 = __importDefault(require("../Icon"));
const Container = styled_components_1.default.div `
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 0;
  gap: ${({ theme }) => theme.gap.xxs.value};
  cursor: pointer;

  p {
    margin: 0;
  }
`;
const CheckboxContainer = (0, styled_components_1.default)(RadixCheckbox.Root) `
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  width: ${({ theme }) => theme.width.sm.value};
  height: ${({ theme }) => theme.height.sm.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-sm'].value};
  border-style: solid;
  background-color: ${({ checked, theme }) => checked ? theme.backgroundColor.interactive['primary-default'].value : 'transparent'};
  border-width: ${({ theme, checked }) => checked ? theme.borderWidth['width-zero'].value : theme.borderWidth['width-sm'].value};
  border-color: ${({ theme }) => theme.borderColor.interactive.default.value};
  box-sizing: border-box;
  justify-content: center;
  align-items: center;

  &[data-state='checked'] {
    &:hover {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
    }
    &:disabled {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
    }
  }

  &[data-state='unchecked'] {
    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive['hover'].value};
    }
    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive['disabled'].value};
    }
  }

  &${Icon_1.default.prototype} {
    padding: 0;
    font-family: var(--ds-icons);
  }
`;
exports.default = {
    Container,
    CheckboxContainer,
};
//# sourceMappingURL=styles.js.map
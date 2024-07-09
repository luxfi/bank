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
const RadixRadioGroup = __importStar(require("@radix-ui/react-radio-group"));
const Root = (0, styled_components_1.default)(RadixRadioGroup.Root) `
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxs.value};
`;
const ItemContainer = styled_components_1.default.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.xxs.value};
`;
const Indicator = styled_components_1.default.div `
  width: ${({ theme }) => theme.width.xxs.value};
  height: ${({ theme }) => theme.height.xxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  border: none;
`;
const Item = (0, styled_components_1.default)(RadixRadioGroup.Item) `
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.padding.xxxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
  background: transparent;
  border-width: ${({ theme }) => theme.borderWidth['width-sm'].value};
  border-style: solid;
  cursor: pointer;

  &[data-state='checked'] {
    border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
    ${Indicator} {
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-default'].value};
    }

    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive.primary.value};
      ${Indicator} {
        background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-hover'].value};
      }
    }

    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive.disabled.value};
      background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
      ${Indicator} {
        background-color: ${({ theme }) => theme.backgroundColor.interactive['primary-disabled'].value};
      }
    }
  }

  &[data-state='unchecked'] {
    border-color: ${({ theme }) => theme.borderColor.interactive.default.value};

    &:hover {
      border-color: ${({ theme }) => theme.borderColor.interactive.hover.value};
    }

    &:disabled {
      border-color: ${({ theme }) => theme.borderColor.interactive.disabled.value};
    }
  }
`;
exports.default = {
    Root,
    Item,
    ItemContainer,
    Indicator,
};
//# sourceMappingURL=styles.js.map
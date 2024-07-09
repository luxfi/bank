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
const Icon_1 = __importDefault(require("../Icon"));
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
const roundnessContent = {
    none: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  `,
    rounded: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
    pill: (0, styled_components_1.css) `
    border-radius: ${({ theme }) => theme.borderRadius['radius-md'].value};
  `,
};
const Container = styled_components_1.default.div `
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;
`;
const ButtonSelect = styled_components_1.default.button `
  --button-color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  --button-borderColor: ${({ theme, $errorText }) => $errorText ? theme.borderColor.feedback.negative.value : theme.borderColor.interactive.default.value};
  --button-backgroundColor: transparent;

  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;

  border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.xs.value}`};
  background-color: var(--button-backgroundColor);
  color: var(--button-color);
  border: solid ${({ theme }) => theme.borderWidth['width-sm'].value} var(--button-borderColor);
  width: 100%;
  cursor: pointer;
  outline: none;
  pointer-events: ${({ $disabled }) => $disabled && 'none'};

  ${({ $roundness }) => roundness[$roundness || 'none']};

  p {
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: var(--button-color);
  }

  span {
    color: var(--button-color);
  }

  &&${Icon_1.default.prototype} {
    font-family: var(--ds-icons);
  }

  &[disabled] {
    --button-color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    --button-borderColor: ${({ theme }) => theme.borderColor.interactive.disabled.value};
    --button-backgroundColor: ${({ theme }) => theme.backgroundColor.interactive['surface-disabled'].value};
  }

  &:focus {
    --trigger-borderColor: ${({ theme }) => theme.borderColor.interactive['focus-default'].value};
  }
`;
const DropContainer = styled_components_1.default.div `
  background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
  border: solid
    ${({ theme }) => `${theme.borderWidth['width-sm'].value} ${theme.borderColor.interactive.default.value}`};
  box-shadow: ${({ theme }) => {
    const { x, y, blur, spread, color } = theme.boxShadow['level-1'].value;
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}};
  z-index: 1000;

  ${({ $roundness }) => roundnessContent[$roundness || 'none']}
`;
const DropButtonsWrap = styled_components_1.default.div `
  position: absolute;
  bottom: 0;
  background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
  width: 100%;
  border-top: solid
    ${({ theme }) => `${theme.borderWidth['width-sm'].value} ${theme.borderColor.interactive.default.value}`};
`;
const DropButtonsContainer = styled_components_1.default.div `
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.gap.xs.value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.sm.value}`};
`;
const ListContainer = styled_components_1.default.ul `
  --limit-show-items-5: calc(${({ theme }) => theme.height['60x'].value} - ${({ theme }) => theme.height.sm.value});
  --limit-space-item: calc(${({ theme }) => theme.padding.xxxl.value} + 6px);

  max-height: var(--limit-show-items-5);
  padding: ${({ theme }) => `${theme.padding.zero.value}`};
  padding-bottom: var(--limit-space-item);
  margin: ${({ theme }) => theme.margin.zero.value};
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  list-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const ListItem = styled_components_1.default.li `
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.gap.sm.value};
  padding: ${({ theme }) => theme.padding.xs.value};
  cursor: pointer;

  p {
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &:hover {
    color: ${({ theme }) => theme.textColor.layout.secondary.value};
    background-color: ${({ theme }) => theme.backgroundColor.interactive['surface-hover'].value};
  }
`;
const ErrorHelperContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  padding-left: ${({ theme }) => theme.padding.xs.value};
`;
exports.default = {
    Container,
    ButtonSelect,
    DropButtonsWrap,
    DropButtonsContainer,
    DropContainer,
    ListContainer,
    ListItem,
    ErrorHelperContainer,
};
//# sourceMappingURL=styles.js.map
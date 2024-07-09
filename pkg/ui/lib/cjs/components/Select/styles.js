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
const RadixSelect = __importStar(require("@radix-ui/react-select"));
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xxxs.value};
  width: 100%;
`;
const WrapTrigger = styled_components_1.default.span `
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: red;
  justify-content: start;
`;
const Trigger = (0, styled_components_1.default)(RadixSelect.Trigger) `
  --trigger-color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  --trigger-borderColor: ${({ theme, $errorText }) => $errorText ? theme.borderColor.feedback.negative.value : theme.borderColor.interactive.default.value};
  --trigger-backgroundColor: transparent;

  display: grid;
  grid-template-columns: auto max-content;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius['radius-zero'].value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.xs.value}`};
  font-size: ${({ theme }) => theme.fontSize.body_md.value};
  gap: ${({ theme }) => theme.gap.xxxs.value};
  background-color: var(--trigger-backgroundColor);
  color: var(--trigger-color);
  border: solid ${({ theme }) => theme.borderWidth['width-sm'].value} var(--trigger-borderColor);
  width: 100%;
  cursor: pointer;
  outline: none;

  ${({ $roundness }) => roundness[$roundness || 'none']};

  button {
    all: unset;
  }

  &[data-placeholder] {
    --trigger-color: ${({ theme }) => theme.textColor.interactive.enabled.value};
  }

  &[data-disabled] {
    --trigger-color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    --trigger-borderColor: ${({ theme }) => theme.borderColor.interactive.disabled.value};
    --trigger-backgroundColor: ${({ theme }) => theme.backgroundColor.interactive['surface-disabled'].value};
  }

  &:focus {
    --trigger-borderColor: ${({ theme }) => theme.borderColor.interactive['focus-default'].value};
  }

  &&${Icon_1.default.prototype} {
    font-family: var(--ds-icons);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    white-space: nowrap;
    color: var(--trigger-color);
  }
`;
const Content = (0, styled_components_1.default)(RadixSelect.Content) `
  overflow: hidden;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  background-color: ${({ theme }) => theme.backgroundColor.layout['container-L1'].value};
  border: solid
    ${({ theme }) => `${theme.borderWidth['width-sm'].value} ${theme.borderColor.interactive.default.value}`};
  z-index: 1000;

  box-shadow: ${({ theme }) => {
    const { x, y, blur, spread, color } = theme.boxShadow['level-1'].value;
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}};

  ${({ $roundness }) => roundnessContent[$roundness || 'none']};
`;
const Item = (0, styled_components_1.default)(RadixSelect.Item) `
  font-size: ${({ theme }) => theme.typography.body.md_regular.value.fontSize};
  line-height: ${({ theme }) => theme.lineHeight.body_md.value};
  color: ${({ theme }) => theme.textColor.layout.secondary.value};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.height.md.value};
  padding: ${({ theme }) => `${theme.padding.xxs.value} ${theme.padding.xs.value}`};
  position: relative;
  user-select: none;
  cursor: pointer;

  &[data-disabled] {
    color: ${({ theme }) => theme.textColor.interactive.disabled.value};
    pointer-events: none;
  }

  &[data-highlighted] {
    outline: none;
    color: ${({ theme }) => theme.textColor.layout.secondary.value};
    background-color: ${({ theme }) => theme.backgroundColor.interactive['surface-hover'].value};
  }

  &[data-state='checked'] {
    font-weight: ${({ theme }) => theme.fontWeight.bold.value};
  }

  > span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const ItemContainer = styled_components_1.default.div `
  display: grid;
  grid-template-columns: auto 1fr;

  > p {
    width: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const ItemTriggerContainer = styled_components_1.default.div `
  display: flex;
  max-height: 22px;

  * {
    display: flex;
    justify-content: center;
    max-height: fit-content;
  }
`;
const ItemCustomElement = styled_components_1.default.div `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-right: ${({ theme }) => theme.padding.xs.value};
`;
const OptionImage = styled_components_1.default.img `
  width: ${({ theme }) => theme.width.md.value};
  height: ${({ theme }) => theme.height.md.value};
  margin-right: ${({ theme }) => theme.padding.xxxs.value};
  border-radius: ${({ theme }) => theme.borderRadius['radius-full'].value};
`;
const ItemIndicator = (0, styled_components_1.default)(RadixSelect.ItemIndicator) `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.width.md.value};
  color: ${({ theme }) => theme.textColor.layout.emphasized.value};
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
    WrapTrigger,
    Trigger,
    Content,
    Item,
    ItemContainer,
    ItemCustomElement,
    ItemIndicator,
    OptionImage,
    ErrorHelperContainer,
    ItemTriggerContainer,
};
//# sourceMappingURL=styles.js.map
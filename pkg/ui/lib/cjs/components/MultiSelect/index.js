'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Theme_1 = require("../../providers/Theme");
const react_1 = __importDefault(require("react"));
const styles_1 = __importDefault(require("./styles"));
const Text_1 = __importDefault(require("../Text"));
const Checkbox_1 = __importDefault(require("../Checkbox"));
const Icon_1 = __importDefault(require("../Icon"));
const Button_1 = __importDefault(require("../Button"));
const react_2 = require("@floating-ui/react");
const MultiSelect = ({ id, label, disabled, roundness = 'none', placeholder = 'Select an option', options, errorText, helperText, onChange, style, }) => {
    const { theme } = (0, Theme_1.useTheme)();
    const [isOpen, setIsOpen] = react_1.default.useState(false);
    const [selectedItems, setSelectedItems] = react_1.default.useState({});
    const { refs, floatingStyles, context } = (0, react_2.useFloating)({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            (0, react_2.offset)(),
            (0, react_2.flip)(),
            (0, react_2.shift)(),
            (0, react_2.size)({
                apply(state) {
                    const { elements, rects } = state;
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    });
                },
                padding: 16,
            }),
        ],
        whileElementsMounted: react_2.autoUpdate,
    });
    const click = (0, react_2.useClick)(context);
    const dismiss = (0, react_2.useDismiss)(context);
    const role = (0, react_2.useRole)(context);
    const { getReferenceProps, getFloatingProps } = (0, react_2.useInteractions)([
        click,
        dismiss,
        role,
    ]);
    const handleOpen = react_1.default.useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);
    const handleClose = react_1.default.useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);
    const errorHelperColor = react_1.default.useMemo(() => {
        if (disabled) {
            return theme.textColor.interactive.disabled.value;
        }
        return errorText
            ? theme.textColor.feedback['text-negative'].value
            : theme.textColor.layout.secondary.value;
    }, [
        disabled,
        errorText,
        theme.textColor.feedback,
        theme.textColor.interactive.disabled.value,
        theme.textColor.layout.secondary.value,
    ]);
    const labelIconsColor = react_1.default.useMemo(() => {
        if (disabled) {
            return theme.textColor.interactive.disabled.value;
        }
        return theme.textColor.interactive.enabled.value;
    }, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.interactive.enabled.value,
    ]);
    const handleSelectItem = react_1.default.useCallback((item) => {
        return () => {
            if (selectedItems[item.value]) {
                const selecteItemsTemp = { ...selectedItems };
                delete selecteItemsTemp[item.value];
                setSelectedItems(selecteItemsTemp);
            }
            else {
                setSelectedItems({ ...selectedItems, [item.value]: item });
            }
        };
    }, [selectedItems, setSelectedItems]);
    const RenderLabel = react_1.default.useCallback(() => {
        if (!label)
            return null;
        return (react_1.default.createElement(Text_1.default, { color: labelIconsColor, as: "label", htmlFor: id || label, variant: "caption_regular" }, label));
    }, [id, label, labelIconsColor]);
    const RenderErrorHelperText = react_1.default.useCallback(() => {
        if (errorText || helperText) {
            return (react_1.default.createElement(styles_1.default.ErrorHelperContainer, null,
                react_1.default.createElement(Text_1.default, { color: errorHelperColor, variant: "caption_regular" }, errorText || helperText)));
        }
    }, [errorHelperColor, errorText, helperText]);
    const RenderButton = react_1.default.useCallback(() => {
        const selectedItemsLength = Object.keys(selectedItems).length;
        const buttonText = selectedItemsLength
            ? `${selectedItemsLength} selected`
            : placeholder;
        return (react_1.default.createElement(styles_1.default.ButtonSelect, { disabled: disabled, onClick: handleOpen, "$roundness": roundness, "$errorText": errorText, ref: refs.setReference },
            react_1.default.createElement(Text_1.default, { variant: "body_md_regular" }, buttonText),
            isOpen ? (react_1.default.createElement(Icon_1.default, { variant: "alt-arrow-up", size: "sm" })) : (react_1.default.createElement(Icon_1.default, { variant: "alt-arrow-down", size: "sm" }))));
    }, [
        disabled,
        errorText,
        handleOpen,
        isOpen,
        placeholder,
        refs.setReference,
        roundness,
        selectedItems,
    ]);
    const RenderItem = react_1.default.useCallback(() => {
        return (react_1.default.createElement(react_1.default.Fragment, null, options.map((item, index) => (react_1.default.createElement(styles_1.default.ListItem, { key: item.value, "aria-selected": !!selectedItems[item.value], onClick: handleSelectItem(item) },
            react_1.default.createElement(Checkbox_1.default, { checked: !!selectedItems[item.value], onChange: () => null }),
            react_1.default.createElement(Text_1.default, { variant: "body_md_regular" }, item.label))))));
    }, [options, selectedItems, handleSelectItem]);
    const handleChange = react_1.default.useCallback(() => {
        onChange(Object.values(selectedItems));
        handleClose();
    }, [onChange, selectedItems, handleClose]);
    const handleClear = () => {
        setSelectedItems({});
        handleClose();
    };
    return (react_1.default.createElement(styles_1.default.Container, { style: style },
        react_1.default.createElement(RenderLabel, null),
        react_1.default.createElement(RenderButton, { ...getReferenceProps() }),
        isOpen && (react_1.default.createElement(react_2.FloatingFocusManager, { context: context, modal: false },
            react_1.default.createElement(styles_1.default.DropContainer, { "$roundness": roundness, ref: refs.setFloating, style: floatingStyles, ...getFloatingProps() },
                react_1.default.createElement(styles_1.default.ListContainer, null,
                    react_1.default.createElement(RenderItem, null)),
                react_1.default.createElement(styles_1.default.DropButtonsWrap, null,
                    react_1.default.createElement(styles_1.default.DropButtonsContainer, null,
                        react_1.default.createElement(Button_1.default, { variant: "tertiary", text: "Clear", size: "default", onClick: handleClear }),
                        react_1.default.createElement(Button_1.default, { text: "Apply", size: "default", onClick: handleChange })))))),
        react_1.default.createElement(RenderErrorHelperText, null)));
};
exports.default = MultiSelect;
//# sourceMappingURL=index.js.map
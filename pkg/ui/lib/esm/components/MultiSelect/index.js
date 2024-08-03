'use client';
import { useTheme } from '../../providers/Theme';
import React from 'react';
import Styled from './styles';
import Text from '../Text';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import Button from '../Button';
import { useFloating, autoUpdate, offset, flip, shift, useClick, useDismiss, useRole, useInteractions, FloatingFocusManager, size, } from '@floating-ui/react';
const MultiSelect = ({ id, label, disabled, roundness = 'none', placeholder = 'Select an option', options, errorText, helperText, onChange, style, }) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState({});
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(),
            flip(),
            shift(),
            size({
                apply(state) {
                    const { elements, rects } = state;
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    });
                },
                padding: 16,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);
    const handleOpen = React.useCallback(() => {
        setIsOpen(true);
    }, [setIsOpen]);
    const handleClose = React.useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);
    const errorHelperColor = React.useMemo(() => {
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
    const labelIconsColor = React.useMemo(() => {
        if (disabled) {
            return theme.textColor.interactive.disabled.value;
        }
        return theme.textColor.interactive.enabled.value;
    }, [
        disabled,
        theme.textColor.interactive.disabled.value,
        theme.textColor.interactive.enabled.value,
    ]);
    const handleSelectItem = React.useCallback((item) => {
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
    const RenderLabel = React.useCallback(() => {
        if (!label)
            return null;
        return (React.createElement(Text, { color: labelIconsColor, as: "label", htmlFor: id || label, variant: "caption_regular" }, label));
    }, [id, label, labelIconsColor]);
    const RenderErrorHelperText = React.useCallback(() => {
        if (errorText || helperText) {
            return (React.createElement(Styled.ErrorHelperContainer, null,
                React.createElement(Text, { color: errorHelperColor, variant: "caption_regular" }, errorText || helperText)));
        }
    }, [errorHelperColor, errorText, helperText]);
    const RenderButton = React.useCallback(() => {
        const selectedItemsLength = Object.keys(selectedItems).length;
        const buttonText = selectedItemsLength
            ? `${selectedItemsLength} selected`
            : placeholder;
        return (React.createElement(Styled.ButtonSelect, { disabled: disabled, onClick: handleOpen, "$roundness": roundness, "$errorText": errorText, ref: refs.setReference },
            React.createElement(Text, { variant: "body_md_regular" }, buttonText),
            isOpen ? (React.createElement(Icon, { variant: "alt-arrow-up", size: "sm" })) : (React.createElement(Icon, { variant: "alt-arrow-down", size: "sm" }))));
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
    const RenderItem = React.useCallback(() => {
        return (React.createElement(React.Fragment, null, options.map((item, index) => (React.createElement(Styled.ListItem, { key: item.value, "aria-selected": !!selectedItems[item.value], onClick: handleSelectItem(item) },
            React.createElement(Checkbox, { checked: !!selectedItems[item.value], onChange: () => null }),
            React.createElement(Text, { variant: "body_md_regular" }, item.label))))));
    }, [options, selectedItems, handleSelectItem]);
    const handleChange = React.useCallback(() => {
        onChange(Object.values(selectedItems));
        handleClose();
    }, [onChange, selectedItems, handleClose]);
    const handleClear = () => {
        setSelectedItems({});
        handleClose();
    };
    return (React.createElement(Styled.Container, { style: style },
        React.createElement(RenderLabel, null),
        React.createElement(RenderButton, { ...getReferenceProps() }),
        isOpen && (React.createElement(FloatingFocusManager, { context: context, modal: false },
            React.createElement(Styled.DropContainer, { "$roundness": roundness, ref: refs.setFloating, style: floatingStyles, ...getFloatingProps() },
                React.createElement(Styled.ListContainer, null,
                    React.createElement(RenderItem, null)),
                React.createElement(Styled.DropButtonsWrap, null,
                    React.createElement(Styled.DropButtonsContainer, null,
                        React.createElement(Button, { variant: "tertiary", text: "Clear", size: "default", onClick: handleClear }),
                        React.createElement(Button, { text: "Apply", size: "default", onClick: handleChange })))))),
        React.createElement(RenderErrorHelperText, null)));
};
export default MultiSelect;
//# sourceMappingURL=index.js.map
'use client';

import { useTheme } from '../../providers/Theme';

import React from 'react';
import Styled from './styles';
import {
  IMultiSelectProps,
  TMultiSelectOption,
  TMultiSelectedItems,
} from './types';
import Text from '../Text';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import Button from '../Button';

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  size,
  MiddlewareState,
} from '@floating-ui/react';

const MultiSelect: React.FC<IMultiSelectProps> = ({
  id,
  label,
  disabled,
  roundness = 'none',
  placeholder = 'Select an option',
  options,
  errorText,
  helperText,
  onChange,
  style,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<TMultiSelectedItems>(
    {}
  );
  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(),
      flip(),
      shift(),
      size({
        apply(state: MiddlewareState) {
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

  const handleSelectItem = React.useCallback(
    (item: TMultiSelectOption) => {
      return () => {
        if (selectedItems[item.value]) {
          const selecteItemsTemp = { ...selectedItems };
          delete selecteItemsTemp[item.value];
          setSelectedItems(selecteItemsTemp);
        } else {
          setSelectedItems({ ...selectedItems, [item.value]: item });
        }
      };
    },
    [selectedItems, setSelectedItems]
  );

  const RenderLabel = React.useCallback(() => {
    if (!label) return null;

    return (
      <Text
        color={labelIconsColor}
        as="label"
        htmlFor={id || label}
        variant="caption_regular"
      >
        {label}
      </Text>
    );
  }, [id, label, labelIconsColor]);

  const RenderErrorHelperText = React.useCallback(() => {
    if (errorText || helperText) {
      return (
        <Styled.ErrorHelperContainer>
          <Text color={errorHelperColor} variant="caption_regular">
            {errorText || helperText}
          </Text>
        </Styled.ErrorHelperContainer>
      );
    }
  }, [errorHelperColor, errorText, helperText]);

  const RenderButton = React.useCallback(() => {
    const selectedItemsLength = Object.keys(selectedItems).length;

    const buttonText = selectedItemsLength
      ? `${selectedItemsLength} selected`
      : placeholder;

    return (
      <Styled.ButtonSelect
        disabled={disabled}
        onClick={handleOpen}
        $roundness={roundness}
        $errorText={errorText}
        ref={refs.setReference}
      >
        <Text variant="body_md_regular">{buttonText}</Text>
        {isOpen ? (
          <Icon variant="alt-arrow-up" size="sm" />
        ) : (
          <Icon variant="alt-arrow-down" size="sm" />
        )}
      </Styled.ButtonSelect>
    );
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
    return (
      <>
        {options.map((item, index) => (
          <Styled.ListItem
            key={item.value}
            aria-selected={!!selectedItems[item.value]}
            onClick={handleSelectItem(item)}
          >
            <Checkbox
              checked={!!selectedItems[item.value]}
              onChange={() => null}
            />
            <Text variant="body_md_regular">{item.label}</Text>
          </Styled.ListItem>
        ))}
      </>
    );
  }, [options, selectedItems, handleSelectItem]);

  const handleChange = React.useCallback(() => {
    onChange(Object.values(selectedItems));
    handleClose();
  }, [onChange, selectedItems, handleClose]);

  const handleClear = () => {
    setSelectedItems({});
    handleClose();
  };

  return (
    <Styled.Container style={style}>
      <RenderLabel />
      <RenderButton {...getReferenceProps()} />
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <Styled.DropContainer
            $roundness={roundness}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <Styled.ListContainer>
              <RenderItem />
            </Styled.ListContainer>
            <Styled.DropButtonsWrap>
              <Styled.DropButtonsContainer>
                <Button
                  variant="tertiary"
                  text="Clear"
                  size="default"
                  onClick={handleClear}
                />
                <Button text="Apply" size="default" onClick={handleChange} />
              </Styled.DropButtonsContainer>
            </Styled.DropButtonsWrap>
          </Styled.DropContainer>
        </FloatingFocusManager>
      )}
      <RenderErrorHelperText />
    </Styled.Container>
  );
};

export default MultiSelect;

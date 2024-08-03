import { IIconProps, Icon, Text } from '@luxbank/ui';
import styled from 'styled-components';

interface IProps {
  label: string;
  icon: IIconProps['variant'];
  iconPlacement?: 'left' | 'right';
  iconSize?: IIconProps['size'];
  iconColor?: IIconProps['color'];
  disabled?: boolean;
  onClick?: () => void;
}
export function ButtonWithIcon({
  label,
  icon,
  iconPlacement = 'right',
  iconSize = 'sm',
  iconColor,
  disabled = false,
  onClick,
}: IProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {iconPlacement === 'left' && (
        <Icon variant={icon} size={iconSize} color={iconColor} />
      )}
      <Text variant="body_sm_semibold">{label}</Text>
      {iconPlacement === 'right' && (
        <Icon variant={icon} size={iconSize} color={iconColor} />
      )}
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.gap.xxs.value};
  color: ${(props) => props.theme.textColor.layout.primary.value};
  background: transparent;
  text-align: center;
  border-radius: ${(props) => props.theme.borderRadius['radius-md'].value};
  width: 100%;
  padding-inline: ${(props) => props.theme.padding.sm.value};
  padding-block: ${(props) => props.theme.padding.xxxs.value};
  transition: all 0.2s ease-in-out;
  width: fit-content;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.theme.backgroundColor.interactive['secondary-hover'].value};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

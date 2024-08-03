import { IIconProps, Icon, Text, useTheme } from '@luxbank/ui';
import { TTextVariants } from '@luxbank/ui/lib/esm/components/Text/types';

import { Container, getColors } from './styles';

export interface IBadge {
  label: string;
  variant: 'positive' | 'negative' | 'warning' | 'info' | 'neutral';
  type?: 'dot' | 'tag';
  icon?: IIconProps['variant'];
  onClickIcon?(): void;
  textVariant?: TTextVariants;
}
export function Badge({
  label,
  variant,
  textVariant = 'caption_regular',
  type = 'tag',
  icon,
  onClickIcon,
}: IBadge) {
  const { theme } = useTheme();
  const color = getColors(variant, theme).font;
  return (
    <Container $type={type} $variant={variant}>
      {type === 'dot' && <div className="dot"></div>}
      <Text
        variant={textVariant}
        color={type === 'tag' ? color : theme.textColor.layout.primary.value}
      >
        {label}
      </Text>
      {icon && type === 'tag' && (
        <div style={{ cursor: onClickIcon ? 'pointer' : 'default' }}>
          <Icon variant={icon} color={color} size="xs" onClick={onClickIcon} />
        </div>
      )}
    </Container>
  );
}

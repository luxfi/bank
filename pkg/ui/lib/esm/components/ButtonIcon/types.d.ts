/// <reference types="react" />
import type { TIconVariants } from '../Icon/types';
export type TButtonIconVariants = 'primary' | 'secondary' | 'tertiary';
export type TButtonIconSizes = 'default' | 'small';
export type TButtonIconRoundness = 'none' | 'rounded' | 'pill';
export interface IButtonIconProps {
    variant?: TButtonIconVariants;
    size?: TButtonIconSizes;
    icon: TIconVariants;
    roundness?: TButtonIconRoundness;
    disabled?: boolean;
    onClick?: () => void;
    id?: string;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map
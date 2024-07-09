import type { TIconVariants } from '../Icon/types';

export type TButtonVariants =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive';

export type TButtonSizes = 'default' | 'small';

export type TButtonRoundness = 'none' | 'rounded' | 'pill';

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: TButtonVariants;
  size?: TButtonSizes;
  leftIcon?: TIconVariants;
  rightIcon?: TIconVariants;
  roundness?: TButtonRoundness;
  fillContent?: boolean;
  isLoading?: boolean;
}

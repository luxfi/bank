import { ITheme } from '../../styles/theme';

export type TCardJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'strech';

export type TCardAlign =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'stretch'
  | 'baseline'
  | 'initial'
  | 'inherit';

export type TCardDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse';

export type TCardWidth =
  | 'fit-content'
  | 'fill'
  | 'max-content'
  | 'min-content'
  | string;

export type TCardHeight =
  | 'fit-content'
  | 'fill'
  | 'max-content'
  | 'min-content'
  | string;

export type TCardOverflow = 'visible' | 'hidden' | 'scroll' | 'auto';

export type TCardWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

export type TCardGap = keyof ITheme['gap'];

export type TCardPadding = keyof ITheme['padding'];

export type TCardMargin = keyof ITheme['margin'];

export type TCardBorderRadius = keyof ITheme['borderRadius'];

export type TCardBorderWidth = keyof ITheme['borderWidth'];

export interface ICardProps {
  children?: React.ReactNode;
  width?: TCardWidth;
  minWidth?: TCardWidth;
  maxWidth?: TCardWidth;
  height?: TCardHeight;
  minHeight?: TCardHeight;
  maxHeight?: TCardHeight;
  direction?: TCardDirection;
  justify?: TCardJustify;
  align?: TCardAlign;
  wrap?: TCardWrap;
  gap?: TCardGap;
  padding?: TCardPadding;
  margin?: TCardMargin;
  borderWidth?: TCardBorderWidth;
  borderRadius?: TCardBorderRadius;
  borderColor?: string;
  overflow?: TCardOverflow;
  backgroundColor?: string;
  shadow?: keyof ITheme['boxShadow'];
  id?: string;
  style?: React.CSSProperties;
}

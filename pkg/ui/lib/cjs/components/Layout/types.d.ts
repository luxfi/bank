/// <reference types="react" />
import { ITheme } from '../../styles/theme';
export type TLayoutJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'strech';
export type TLayoutAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' | 'initial' | 'inherit';
export type TLayoutDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type TLayoutWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type TLayoutGap = keyof ITheme['gap'];
export type TLayoutRowGap = keyof ITheme['gap'];
export type TLayoutColumnGap = keyof ITheme['gap'];
export type TLayoutGridRowGap = keyof ITheme['gap'];
export type TLayoutGridColumnGap = keyof ITheme['gap'];
export type TLayoutPadding = keyof ITheme['padding'];
export type TLayoutMargin = keyof ITheme['margin'];
export type TLayoutBorderRadius = keyof ITheme['borderRadius'];
export interface ILayoutProps {
    fillContent?: boolean;
    justify?: TLayoutJustify;
    align?: TLayoutAlign;
    direction?: TLayoutDirection;
    wrap?: TLayoutWrap;
    gap?: TLayoutGap;
    rowGap?: TLayoutRowGap;
    columnGap?: TLayoutColumnGap;
    gridRowGap?: TLayoutGridRowGap;
    gridColumnGap?: TLayoutGridColumnGap;
    padding?: TLayoutPadding;
    margin?: TLayoutMargin;
    backgroundColor?: string;
    width?: string;
    height?: string;
    borderRadius?: TLayoutBorderRadius;
    children: React.ReactNode;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map
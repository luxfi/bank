/// <reference types="react" />
import { ITheme } from '../../styles/theme';
export type TColumnJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'strech';
export type TColumnAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' | 'initial' | 'inherit';
export type TColumnWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type TColumnGap = keyof ITheme['gap'];
export type TColumnPadding = keyof ITheme['padding'];
export type TColumnMargin = keyof ITheme['margin'];
export interface IColumnProps {
    justify?: TColumnJustify;
    align?: TColumnAlign;
    wrap?: TColumnWrap;
    gap?: TColumnGap;
    padding?: TColumnPadding;
    margin?: TColumnMargin;
    width?: string;
    height?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map
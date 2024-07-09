/// <reference types="react" />
import { ITheme } from '../../styles/theme';
export type TRowJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly' | 'strech';
export type TRowAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline' | 'initial' | 'inherit';
export type TRowWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
export type TRowGap = keyof ITheme['gap'];
export type TRowPadding = keyof ITheme['padding'];
export type TRowMargin = keyof ITheme['margin'];
export interface IRowProps {
    justify?: TRowJustify;
    align?: TRowAlign;
    wrap?: TRowWrap;
    gap?: TRowGap;
    padding?: TRowPadding;
    margin?: TRowMargin;
    width?: string;
    height?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map
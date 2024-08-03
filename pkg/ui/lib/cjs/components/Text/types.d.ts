import type { HTMLAttributeAnchorTarget } from 'react';
export type TTextVariants = 'body_sm_regular' | 'body_sm_bold' | 'body_sm_semibold' | 'body_md_regular' | 'body_md_bold' | 'body_md_semibold' | 'callout_regular' | 'callout_bold' | 'callout_semibold' | 'headline_regular' | 'headline_bold' | 'headline_semibold' | 'heading_title_1' | 'heading_title_2' | 'heading_title_3' | 'caption_regular' | 'caption_bold' | 'interactive_md_link' | 'interactive_sm_link' | 'interactive_sm_regular' | 'interactive_sm_bold' | 'interactive_sm_semibold' | 'interactive_md_bold' | 'interactive_md_semibold' | 'interactive_md_regular';
export type TTextAlign = 'left' | 'center' | 'right';
export interface ITextProps {
    variant: TTextVariants;
    color?: string;
    children: React.ReactNode;
    textAlign?: TTextAlign;
    href?: string;
    target?: HTMLAttributeAnchorTarget;
    as?: 'label' | 'p';
    id?: string;
    htmlFor?: string;
    style?: React.CSSProperties;
}
//# sourceMappingURL=types.d.ts.map
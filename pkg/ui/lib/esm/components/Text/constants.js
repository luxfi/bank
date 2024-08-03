import { css } from 'styled-components';
export const variants = {
    body_sm_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.sm_regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.sm_regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.sm_regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.sm_regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.sm_regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.sm_regular.value.textDecoration};
  `,
    body_sm_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.sm_bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.sm_bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.sm_bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.sm_bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.sm_bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.sm_bold.value.textDecoration};
  `,
    body_sm_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.sm_semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.sm_semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.sm_semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.sm_semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.sm_semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.sm_semibold.value.textDecoration};
  `,
    body_md_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.md_regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.md_regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.md_regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.md_regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.md_regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.md_regular.value.textDecoration};
  `,
    body_md_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.md_bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.md_bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.md_bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.md_bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.md_bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.md_bold.value.textDecoration};
  `,
    body_md_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.body.md_semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.body.md_semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.md_semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.md_semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.body.md_semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.body.md_semibold.value.textDecoration};
  `,
    callout_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.callout.regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.callout.regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.callout.regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.callout.regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.callout.regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.callout.regular.value.textDecoration};
  `,
    callout_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.callout.bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.callout.bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.callout.bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.callout.bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.callout.bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.callout.bold.value.textDecoration};
  `,
    callout_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.callout.semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.callout.semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.callout.semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.callout.semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.callout.semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.callout.semibold.value.textDecoration};
  `,
    headline_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.headline.regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.headline.regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.headline.regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.headline.regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.headline.regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.headline.regular.value.textDecoration};
  `,
    headline_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.headline.bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.headline.bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.headline.bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.headline.bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.headline.bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.headline.bold.value.textDecoration};
  `,
    headline_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.headline.semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.headline.semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.headline.semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.headline.semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.headline.semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.headline.semibold.value.textDecoration};
  `,
    heading_title_1: css `
    font-family: ${({ theme }) => `var(--${theme.typography.heading.title_1.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.heading.title_1.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.heading.title_1.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.heading.title_1.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.heading.title_1.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.heading.title_1.value.textDecoration};
  `,
    heading_title_2: css `
    font-family: ${({ theme }) => `var(--${theme.typography.heading.title_2.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.heading.title_2.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.heading.title_2.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.heading.title_2.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.heading.title_2.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.heading.title_2.value.textDecoration};
  `,
    heading_title_3: css `
    font-family: ${({ theme }) => `var(--${theme.typography.heading.title_3.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.heading.title_3.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.heading.title_3.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.heading.title_3.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.heading.title_3.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.heading.title_3.value.textDecoration};
  `,
    caption_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.caption.regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.caption.regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.caption.regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.caption.regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.caption.regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.caption.regular.value.textDecoration};
  `,
    caption_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.caption.bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.caption.bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.caption.bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.caption.bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.caption.bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.caption.bold.value.textDecoration};
  `,
    interactive_md_link: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.md_link.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.md_link.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.md_link.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.md_link.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.md_link.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.md_link.value.textDecoration};
  `,
    interactive_sm_link: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.sm_link.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.sm_link.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.sm_link.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.sm_link.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.sm_link.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.sm_link.value.textDecoration};
  `,
    interactive_sm_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.sm_regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.sm_regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.sm_regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.sm_regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.sm_regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.sm_regular.value.textDecoration};
  `,
    interactive_sm_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.sm_bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.sm_bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.sm_bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.sm_bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.sm_bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.sm_bold.value.textDecoration};
  `,
    interactive_sm_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.sm_semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.sm_semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.sm_semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.sm_semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.sm_semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.sm_semibold.value.textDecoration};
  `,
    interactive_md_bold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.md_bold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.md_bold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.md_bold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.md_bold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.md_bold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.md_bold.value.textDecoration};
  `,
    interactive_md_semibold: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.md_semibold.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.md_semibold.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.md_semibold.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.md_semibold.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.md_semibold.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.md_semibold.value.textDecoration};
  `,
    interactive_md_regular: css `
    font-family: ${({ theme }) => `var(--${theme.typography.interactive.md_regular.value.fontFamily})`};
    font-weight: ${({ theme }) => theme.typography.interactive.md_regular.value.fontWeight};
    line-height: ${({ theme }) => theme.typography.interactive.md_regular.value.lineHeight};
    font-size: ${({ theme }) => theme.typography.interactive.md_regular.value.fontSize};
    letter-spacing: ${({ theme }) => theme.typography.interactive.md_regular.value.letterSpacing};
    text-decoration: ${({ theme }) => theme.typography.interactive.md_regular.value.textDecoration};
  `,
};
//# sourceMappingURL=constants.js.map
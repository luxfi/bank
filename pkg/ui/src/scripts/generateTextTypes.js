/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const prettier = require('prettier');

const theme = require('../styles/theme/light.json');

(async function main() {
  const variants = Object.keys(theme.typography)
    .map((variant) => {
      return Object.keys(theme.typography[variant]).map((weight) => {
        return `${variant}_${weight}`;
      });
    })
    .flat(1);

  const variantsStyles = Object.keys(theme.typography).reduce(
    (acc, variant) => {
      Object.keys(theme.typography[variant]).map((weight) => {
        acc[`${variant}_${weight}`] = `css\`
      font-family: \${({ theme }) => theme.typography.${variant}.${weight}.value.fontFamily};
      font-weight: \${({ theme }) => theme.typography.${variant}.${weight}.value.fontWeight};
      line-height: \${({ theme }) => theme.typography.${variant}.${weight}.value.lineHeight};
      font-size: \${({ theme }) => theme.typography.${variant}.${weight}.value.fontSize};
      letter-spacing: \${({ theme }) => theme.typography.${variant}.${weight}.value.letterSpacing};
      text-decoration: \${({ theme }) => theme.typography.${variant}.${weight}.value.textDecoration};
    `;
      });

      return acc;
    },
    {}
  );

  const typesContent = `
  import type { HTMLAttributeAnchorTarget } from 'react';

  export type TTextVariants = ${JSON.stringify(variants)
    .replace(/(\[|\])/g, '')
    .replace(/,/g, '|')};

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
`;

  const options = {
    parser: 'typescript',
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
  };

  const formatted = await prettier.format(typesContent, options);

  fs.writeFile('src/components/Text/types.ts', formatted, (error) =>
    error ? console.log(error) : console.log('Successfully created Text styles')
  );
})();

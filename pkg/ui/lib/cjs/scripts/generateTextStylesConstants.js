/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const prettier = require('prettier');
const theme = require('../styles/theme/light.json');
(async function main() {
    const variantsStyles = Object.keys(theme.typography).reduce((acc, variant) => {
        Object.keys(theme.typography[variant]).map((weight) => {
            acc[`${variant}_${weight}`] = `css\`
      font-family: \${({ theme }) => \`var(--\${theme.typography.${variant}.${weight}.value.fontFamily})\`};
      font-weight: \${({ theme }) => theme.typography.${variant}.${weight}.value.fontWeight};
      line-height: \${({ theme }) => theme.typography.${variant}.${weight}.value.lineHeight};
      font-size: \${({ theme }) => theme.typography.${variant}.${weight}.value.fontSize};
      letter-spacing: \${({ theme }) => theme.typography.${variant}.${weight}.value.letterSpacing};
      text-decoration: \${({ theme }) => theme.typography.${variant}.${weight}.value.textDecoration};
    \``;
        });
        return acc;
    }, {});
    const typesContent = `
  import { css } from 'styled-components';

  import type { RuleSet } from 'styled-components';

  import type { TTextVariants } from './types';

  export const variants: { [key in TTextVariants]: RuleSet<object> } = ${JSON.stringify(variantsStyles)
        .replace(/(\\n)/g, '')
        .replace(/("css)/g, 'css')
        .replace(/(")/g, '')};
`;
    const options = {
        parser: 'typescript',
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
    };
    const formatted = await prettier.format(typesContent, options);
    fs.writeFile('src/components/Text/constants.ts', formatted, (error) => error ? console.log(error) : console.log('Successfully created Text types'));
})();
//# sourceMappingURL=generateTextStylesConstants.js.map
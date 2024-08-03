/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const prettier = require('prettier');

const iconsJSON = require('../styles/fonts/ds-icons.json');

(async function main() {
  const names = iconsJSON.icons.map((icon) => icon.properties.name);

  const content = `
  export type TIconSizes = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

  export interface IIconProps {
    variant: TIconVariants;
    color?: string;
    onClick?: () => void;
    size?: TIconSizes;
    style?: React.CSSProperties;
  }

  export type TIconVariants = ${JSON.stringify(names)
    .replace(/(\[|\])/g, '')
    .replace(/,/g, '|')
    .toLowerCase()};
`;

  const options = {
    parser: 'typescript',
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
  };

  const formatted = await prettier.format(content, options);

  fs.writeFile('src/components/Icon/types.ts', formatted, (error) =>
    error ? console.log(error) : console.log('Successfully created Icon types')
  );
})();

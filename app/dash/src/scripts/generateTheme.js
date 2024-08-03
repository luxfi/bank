import fs from 'fs';
import prettier from 'prettier';
import { transformTokens } from 'token-transformer';

import rawTokens from '../styles/theme/tokens.json';

/* 
const fs = require('fs');
const prettier = require('prettier');
const { transformTokens } = require('token-transformer');
const rawTokens = require('../styles/theme/tokens.json');
*/

(async function main() {
  const light = transformTokens(rawTokens, ['cdax/light', 'core'], ['core']);

  const dark = transformTokens(rawTokens, ['cdax/dark', 'core'], ['core']);

  const content = `
  export interface ILightTheme ${JSON.stringify(light, null, 2)}
  export interface IDarkTheme ${JSON.stringify(dark, null, 2)}
  export type ITheme = ILightTheme | IDarkTheme;
  
  export const lightTheme: ILightTheme = ${JSON.stringify(light, null, 2)};
  export const darkTheme: IDarkTheme = ${JSON.stringify(dark, null, 2)};
  `;

  const options = {
    parser: 'typescript',
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
  };

  const formatted = await prettier.format(content, options);

  fs.writeFile('src/styles/theme/index.ts', formatted, (error) =>
    error ? console.log(error) : console.log('Successfully created theme')
  );
  fs.writeFile(
    'src/styles/theme/light.json',
    JSON.stringify(light, null, 2),
    (error) =>
      error ? console.log(error) : console.log('Successfully created theme')
  );
  fs.writeFile(
    'src/styles/theme/dark.json',
    JSON.stringify(dark, null, 2),
    (error) =>
      error ? console.log(error) : console.log('Successfully created theme')
  );
})();

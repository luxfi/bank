/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const process = require('process');
const prettier = require('prettier');
const { transformTokens } = require('token-transformer');
//arg2 = input file of the tokens
//arg3 = output path
//arg4 = light tokens set
//arg5 = dark tokens set
(async function main() {
    const currentDirPath = process.cwd();
    if (!process.argv[2] === undefined) {
        throw new Error("error: missing argument 'input tokens file'");
    }
    const rawTokensPath = currentDirPath + '/' + process.argv[2];
    const rawTokens = require(rawTokensPath);
    if (!process.argv[3]) {
        throw new Error("error: missing argument 'output path'");
    }
    const outputPath = currentDirPath + '/' + process.argv[3];
    if (!process.argv[4]) {
        throw new Error("error: missing argument 'light tokens set to build'");
    }
    const lightTokensSet = process.argv[4];
    const darkTokensSet = process.argv[5];
    const excludes = ['core'];
    const resolvedLightTokens = transformTokens(rawTokens, [lightTokensSet, 'core'], excludes);
    const resolvedDarkTokens = darkTokensSet
        ? transformTokens(rawTokens, [darkTokensSet, 'core'], excludes)
        : {};
    const content = `
export interface ILightTheme ${JSON.stringify(resolvedLightTokens, null, 2).replace(/"Roboto"/g, 'string')};

export interface IDarkTheme ${JSON.stringify(resolvedDarkTokens, null, 2).replace(/"Roboto"/g, 'string')};

const light: ILightTheme = ${JSON.stringify(resolvedLightTokens, null, 2)};

const dark: IDarkTheme = ${JSON.stringify(resolvedDarkTokens, null, 2)};

export type ITheme = ILightTheme | IDarkTheme;

export default {
  light,
  dark,
};
`;
    const options = {
        parser: 'typescript',
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
    };
    const formatted = await prettier.format(content, options);
    fs.writeFile(outputPath, formatted, async (error) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('successfully generated theme');
        }
    });
})().catch((error) => {
    process.exitCode = 1;
    console.log(error);
});
//# sourceMappingURL=generateThemeTypes.js.map
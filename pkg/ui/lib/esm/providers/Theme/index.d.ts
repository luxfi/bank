import React from 'react';
import { ITheme } from '../../styles/theme';
interface IThemeContext {
    theme: ITheme;
    setTheme: (theme: ITheme) => void;
}
interface IThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: ITheme;
}
export declare const useTheme: () => IThemeContext;
declare const ThemeProvider: React.FC<IThemeProviderProps>;
export default ThemeProvider;
//# sourceMappingURL=index.d.ts.map
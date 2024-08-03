'use client';

import React from 'react';
import {
  DefaultTheme,
  ThemeProvider as StyledThemeProvider,
} from 'styled-components';

import theme, { ITheme } from '../../styles/theme';

interface IThemeContext {
  theme: ITheme;
  setTheme: (theme: ITheme) => void;
}

interface IThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ITheme;
}

const ThemeContext = React.createContext<IThemeContext>({
  theme: theme.light,
  setTheme: () => {},
});

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

const ThemeProvider: React.FC<IThemeProviderProps> = ({
  children,
  defaultTheme,
}) => {
  const [activeTheme, setActiveTheme] = React.useState<ITheme>(
    defaultTheme ?? theme.light
  );

  const setTheme = (_theme: ITheme) => {
    setActiveTheme(_theme);
  };

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setTheme }}>
      <StyledThemeProvider theme={activeTheme as DefaultTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

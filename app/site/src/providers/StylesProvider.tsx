"use client";

import GlobalStyles from "@/styles/globals";
import StyledComponentsRegistry from "@/styles/registryStyledComponents";
import antdTheme from "@/styles/theme/antd";
import { darkTheme, lightTheme } from "@/styles/theme/default";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";
import { ThemeContextProvider, useThemeMode } from "@/context/ThemeContext";

function ThemedContent({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = mode === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

const StyledProviders = (props: React.PropsWithChildren) => {
  return (
    <StyleProvider hashPriority="high">
      <StyledComponentsRegistry>
        <ConfigProvider theme={antdTheme}>
          <ThemeContextProvider>
            <ThemedContent>{props.children}</ThemedContent>
          </ThemeContextProvider>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </StyleProvider>
  );
};

export default StyledProviders;

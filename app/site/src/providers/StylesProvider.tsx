"use client";

import GlobalStyles from "@/styles/globals";
import StyledComponentsRegistry from "@/styles/registryStyledComponents";
import antdTheme from "@/styles/theme/antd";
import { defaultTheme } from "@/styles/theme/default";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "styled-components";

const StyledProviders = (props: React.PropsWithChildren) => {
  return (
    <StyleProvider hashPriority="high">
      <StyledComponentsRegistry>
        <ConfigProvider theme={antdTheme}>
          <ThemeProvider theme={defaultTheme}>
            <GlobalStyles />
            {props.children}
          </ThemeProvider>
        </ConfigProvider>
      </StyledComponentsRegistry>
    </StyleProvider>
  );
};

export default StyledProviders;

'use client';

import StyledComponentsRegistry from '@/lib/registryStyledComponents';

import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeProvider } from '@luxbank/ui';
import { Provider as LuxUIProvider } from '@luxfi/ui';
import { ConfigProvider } from 'antd';
import { TamaguiProvider } from '@tamagui/core';

import GlobalStyles from '@/styles/globalStyles';
import { lightTheme } from '@/styles/theme';
import antdTheme from '@/styles/themes/antd';
import { defaultTheme } from '@/styles/themes/default';
import config from '../../tamagui.config';

const StyledProviders = (props: React.PropsWithChildren) => {
  return (
    <StyleProvider hashPriority="high">
      <StyledComponentsRegistry>
        <ThemeProvider defaultTheme={{ ...lightTheme, ...defaultTheme } as any}>
          <ConfigProvider theme={antdTheme}>
            <LuxUIProvider defaultTheme="light">
              <TamaguiProvider config={config} defaultTheme="light">
                <GlobalStyles />
                {props.children}
              </TamaguiProvider>
            </LuxUIProvider>
          </ConfigProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    </StyleProvider>
  );
};

export default StyledProviders;

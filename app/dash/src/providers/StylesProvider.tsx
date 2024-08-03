'use client';

import StyledComponentsRegistry from '@/lib/registryStyledComponents';

import { StyleProvider } from '@ant-design/cssinjs';
import { ThemeProvider } from '@cdaxfx/ui';
import { ConfigProvider } from 'antd';

import GlobalStyles from '@/styles/globalStyles';
import { lightTheme } from '@/styles/theme';
import antdTheme from '@/styles/themes/antd';
import { defaultTheme } from '@/styles/themes/default';

const StyledProviders = (props: React.PropsWithChildren) => {
  return (
    <StyleProvider hashPriority="high">
      <StyledComponentsRegistry>
        <ThemeProvider defaultTheme={{ ...lightTheme, ...defaultTheme } as any}>
          <ConfigProvider theme={antdTheme}>
            <GlobalStyles />
            {props.children}
          </ConfigProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
    </StyleProvider>
  );
};

export default StyledProviders;

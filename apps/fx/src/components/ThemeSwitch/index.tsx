import { useEffect, useLayoutEffect, useState } from 'react';

import { Icon, useTheme } from '@cdaxfx/ui';
import { Switch } from 'antd';
import styled from 'styled-components';

import { darkTheme, lightTheme } from '@/styles/theme';
import { defaultTheme } from '@/styles/themes/default';

export function ThemeSwitch() {
  const { setTheme } = useTheme();
  const [isDarkThemeActive, setIsDarkThemeActive] = useState(false);

  useLayoutEffect(() => {
    const preferedTheme =
      !('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storagedTheme = localStorage.getItem('theme');
    if (storagedTheme === 'dark' || preferedTheme) setIsDarkThemeActive(true);
  }, []);

  useEffect(() => {
    if (isDarkThemeActive) {
      localStorage.setItem('theme', 'dark');
      setTheme({ ...defaultTheme, ...darkTheme } as any);
    } else {
      localStorage.setItem('theme', 'light');
      setTheme({ ...defaultTheme, ...lightTheme } as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkThemeActive]);

  return (
    <Container>
      <CustomSwitch
        onChange={setIsDarkThemeActive}
        unCheckedChildren={<Icon variant="sun" size="sm" color="white" />}
        checkedChildren={<Icon variant="moon" size="sm" color="white" />}
        value={isDarkThemeActive}
        $checked={isDarkThemeActive}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-inline: 12px;
`;
const CustomSwitch = styled(Switch)<{
  $checked: boolean;
}>`
  min-width: 56px;

  .ant-switch-inner-unchecked {
    margin-top: -29px !important;
  }

  .ant-switch-inner {
    background-color: ${(props) =>
      props.$checked
        ? props.theme.backgroundColor.layout['container-emphasized'].value
        : props.theme.backgroundColor.interactive['primary-default']
            .value} !important;
  }
`;

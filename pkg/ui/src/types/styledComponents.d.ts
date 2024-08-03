import 'styled-components';

import type { IDarkTheme, ILightTheme } from '../styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ILightTheme {}
}

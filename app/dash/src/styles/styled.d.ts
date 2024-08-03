import { IDarkTheme, ILightTheme, ITheme } from '@luxbank/ui';
import 'styled-components';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme extends ITheme, ILightTheme, IDarkTheme {}
}

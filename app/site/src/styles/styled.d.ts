import "styled-components";
import { IThemeType } from "./themes/type";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface DefaultTheme extends IThemeType {}
}

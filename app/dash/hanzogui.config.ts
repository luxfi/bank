import { createGui } from '@hanzo/gui'
import { defaultConfig } from '@hanzogui/config/v4'

// The bank's design system on the @hanzo/gui (Tamagui-fork) runtime — grid-css
// native across web, desktop, and mobile. We start from the v4 default config
// (tokens, fonts, animations, the full style-prop set incl. the grid props the
// custom Yoga engine adds) and layer the bank's dark palette on top so existing
// $color tokens resolve to our surfaces.
const conf = createGui(defaultConfig)

export type Conf = typeof conf

declare module '@hanzo/gui' {
  interface TypeOverride {
    groupNames(): 'card' | 'row'
  }
}

export default conf

// The @hanzo/gui runtime provider and the bank's grid-native layout primitives.
// Every layout is CSS grid via the custom Yoga engine — no flexbox — and works
// the same on web, desktop, and mobile. Colours come from the bank's design
// tokens (the CSS variables in main.css), so the look is unchanged while the
// layout engine is now grid.
import type { ReactNode } from 'react'
import { GuiProvider, View, Text, styled } from '@hanzo/gui'
import config from '../hanzogui.config'

export function GuiRoot({ children }: { children: ReactNode }) {
  return (
    <GuiProvider config={config} defaultTheme="dark" disableInjectCSS={false}>
      {children}
    </GuiProvider>
  )
}

// Box is a plain grid cell/container; Grid is a grid with a column template;
// Stack is the vertical rhythm primitive (a single-column grid with a gap) that
// replaces every `flex-col` / `space-y-*`. Column count, gap, and areas are
// props, resolved by the grid engine on every target.
export const Box = styled(View, { name: 'Box', display: 'grid' as any })

export const Grid = styled(View, {
  name: 'Grid',
  display: 'grid' as any,
})

export const Stack = styled(View, {
  name: 'Stack',
  display: 'grid' as any,
  variants: {
    gap: {
      // token → px; matches the app's spacing scale.
      xs: { gap: 4 },
      sm: { gap: 8 },
      md: { gap: 16 },
      lg: { gap: 24 },
      xl: { gap: 32 },
    },
  } as const,
})

export { GuiProvider, View, Text, styled }

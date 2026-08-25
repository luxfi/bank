import '@/fonts.css'
import '@/main.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import { GuiRoot } from '@/gui'
import { label } from '@/hooks/brand'

label()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GuiRoot>
      <App />
    </GuiRoot>
  </StrictMode>,
)

import { preset } from '@luxfi/ui/tailwind'

export default {
  presets: [preset],
  content: {
    files: [
      'src/**/*.tsx',
      './node_modules/@luxfi/ui/**/*.{ts,tsx}',
      './node_modules/@hanzo/**/*.{ts,tsx}'
    ]
  },
  theme: {
    extend: {
      colors: {
        black: "#000000",
        gray: "#e5e7eb",
        'white': 'rgb(255, 255, 255)',
        'white-85': 'rgba(255, 255, 255, 0.85)',
        'white-65': 'rgba(255, 255, 255, 0.65)',
        'white-10': 'rgba(255, 255, 255, 0.1)',
        'dark-grey': 'rgb(30, 30, 30)',
        'dark-grey1': 'rgb(161, 161, 161)',
        'white-grey': 'rgb(237, 237, 237)',
        'white-grey-65': 'rgba(237, 237, 237, 0.65)',
        'primary-black': 'rgb(13, 13, 13)'
      },
      letterSpacing: {
        'negative-tiny': '-0.01em'
      }
    },
  }
}
/// <reference types="react-scripts" />

declare module '@luxfi/logo/react' {
  import { FC } from 'react';
  interface LuxLogoProps {
    size?: number;
    variant?: 'color' | 'white' | 'dark';
    [key: string]: any;
  }
  export const LuxLogo: FC<LuxLogoProps>;
}

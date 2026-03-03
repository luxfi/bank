import { createGlobalStyle } from "styled-components";

import { DeviceSize } from "./theme/default";

const GlobalStyles = createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    --scroll-top-app-main: 'top';

    /* Geist font family */
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;

    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    ::-webkit-scrollbar {
      width: 0.6rem;
    }

    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.background};

    ::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.background};
    }


    ::-webkit-scrollbar-thumb {
      border-radius: 0.3rem;
      background: ${({ theme }) => theme.colors.border};
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) => theme.colors.borderHover || theme.colors.border};
    }
  }

  body {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
    min-height: 100vh;
    transition: background-color 0.2s ease, color 0.2s ease;

    .content {
      width: 100%;
      max-width: 1120px;
      height: 100%;
      padding: 0 2rem;

      @media ${DeviceSize.md} {
        padding: 0 1.5rem;
      }

      @media ${DeviceSize.sm} {
        padding: 0 1rem;
      }
    }
  }

   *, button, input {
      border: 0;
      outline: 0;
      font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    }

  /* Modern link styling */
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.foreground};
  }

  /* Selection styling */
  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accentForeground || theme.colors.background};
  }

  /* Section spacing */
  section {
    padding: 6rem 0;

    @media ${DeviceSize.sm} {
      padding: 4rem 0;
    }
  }

  /* Consistent border-radius */
  :root {
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
  }

`;

export default GlobalStyles;

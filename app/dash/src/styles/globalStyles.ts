import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: var(--font-inter, 'Inter', sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-inter, 'Inter', sans-serif);
  }

  /* Bank form inputs — must survive the universal reset */
  input.bank-input,
  input.bank-pin {
    border: 1px solid #555555;
    padding: 14px 16px;
    background-color: #1A1A1A;
    color: #FFFFFF;
    border-radius: 12px;
    font-size: 16px;
    line-height: 24px;
    width: 100%;
    outline: none;
    font-family: inherit;
    -webkit-appearance: none;
    appearance: none;
  }
  input.bank-input:focus,
  input.bank-pin:focus {
    border-color: #888888;
  }
  input.bank-input::placeholder {
    color: #666666;
  }
  input.bank-input.bank-input-invalid {
    border-color: #FF4444;
  }
  input.bank-input:disabled {
    opacity: 0.5;
  }
  input.bank-pin {
    width: 48px;
    height: 48px;
    padding: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
`;

export default GlobalStyles;

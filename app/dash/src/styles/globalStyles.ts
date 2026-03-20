import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: var(--font-inter, 'Inter', -apple-system, sans-serif);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    background-color: #000000;
    color: #FFFFFF;
  }

  input.bank-input,
  input.bank-pin {
    background-color: #000000 !important;
    color: #FFFFFF !important;
    border: 1px solid #444444 !important;
    border-radius: 16px !important;
    padding: 18px 20px !important;
    font-size: 18px !important;
    line-height: 26px !important;
    width: 100% !important;
    outline: none !important;
    font-family: inherit !important;
    box-sizing: border-box !important;
    -webkit-appearance: none !important;
    appearance: none !important;
  }
  input.bank-input:focus,
  input.bank-pin:focus {
    border-color: #FFFFFF !important;
  }
  input.bank-input::placeholder {
    color: #555555 !important;
  }
  input.bank-input.bank-input-invalid {
    border-color: #FF3B30 !important;
  }
  input.bank-input:disabled {
    opacity: 0.4 !important;
  }
  input.bank-pin {
    width: 52px !important;
    height: 52px !important;
    padding: 0 !important;
    text-align: center !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    border-radius: 14px !important;
  }
`;

export default GlobalStyles;

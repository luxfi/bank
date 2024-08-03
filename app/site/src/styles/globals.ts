import { createGlobalStyle } from "styled-components";

import { DeviceSize } from "./theme/default";

const GlobalStyles = createGlobalStyle` 
  @font-face {
    font-family: 'D-DIN-PRO';
    src: url('/fonts/d-din-pro.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  } 

   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;    
  }

  html {       
    --scroll-top-app-main: 'top';

    font-family: 'D-DIN-PRO', sans-serif;

    font-size: 62.5%;    
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    ::-webkit-scrollbar {
      width: 1rem;
    }
   
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: #00569f;
  
    ::-webkit-scrollbar-track {
      background: #F2F2F2;
    }
  

    ::-webkit-scrollbar-thumb {
      border-radius: .5rem;
      background: #b2b5b8;
    }
  }
  
  body {
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    
    .content{
      width: 85vw;
      max-width: 1440px;
      height: 100%;

      @media ${DeviceSize.md} {
        width: 95%;
        max-width: 100vw;
      }
      
      @media ${DeviceSize.sm} {
        width: 100%;
        max-width: 100vw;
      }
    }
  }

   *, button, input {
      border: 0;
      outline: 0;  
      font-family: 'D-DIN-PRO', sans-serif;    
    }
    
`;

export default GlobalStyles;

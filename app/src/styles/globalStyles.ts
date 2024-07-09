import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle` 
  @font-face {
    src: url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200;0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,200;1,6..12,300;1,6..12,400;1,6..12,500;1,6..12,600;1,6..12,700;1,6..12,800&display=swap');;
    font-family: 'Nunito Sans', sans-serif;
  } 

   * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;    
  }

  html {    
    --scroll-top-app-main: 'top';

    font-family: 'Nunito Sans', sans-serif;
    overflow-y: hidden;

    font-size: 62.5%;    
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    ::-webkit-scrollbar {
      width: 1rem;
      height: 8px;
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

   *, button, input {
      border: 0;
      outline: 0;  
      font-family: 'Nunito Sans', sans-serif;    
    }
    
`;

export default GlobalStyles;

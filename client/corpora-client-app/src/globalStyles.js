import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
    }

  body {
    margin: 0;
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

      /* CSS HEX */
    --middle-blue-green: #a1d2ceff;
    --terra-cotta: #e87461ff;
    --maximum-blue-purple: #a594f9ff;
    --medium-slate-blue: #7371fcff;
    --y-in-mn-blue: #36558fff;

    --surface-main: #fffdfd;

    background-color: var(--surface-main);
  }

  /* Scrollbar */
  *::-webkit-scrollbar {
    width: 4px;
    height: 4px;

    cursor: pointer;
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--y-in-mn-blue) rgba(127, 144, 159, 0.2);
  }
  *::-webkit-scrollbar-track {
    background: rgba(127, 144, 159, 0.2);
  }
  *::-webkit-scrollbar-thumb {
    background-color: var(--y-in-mn-blue) ;
    border-radius: 2px;
    border: transparent;
  }
`;
 
export default GlobalStyle;
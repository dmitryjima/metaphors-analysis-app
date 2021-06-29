import React from 'react';
import ReactDOM from 'react-dom';

import GlobalStyle from './globalStyles';

import { store } from './app/store';
import { Provider } from 'react-redux';

import './i18n';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

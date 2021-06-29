import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

// Toasts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import { handleCheckToken, handleLogin, handleLogout } from './slices/userSlice';
import Navbar from './components/layout/navbar';
import Sidebar from './components/layout/sidebar';
import { handleFetchEditions } from './slices/editionsSlice';



function App() {
  const { t, i18n, ready } = useTranslation("test");

  const dispatch = useDispatch();
  const state = useSelector(state => state);


  useEffect(() => {
    dispatch(handleFetchEditions());
    dispatch(handleCheckToken());
  }, [])

  if (!ready) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter
      basename={(i18n.language && i18n.language.length === 2) ? i18n.language : `en`}
    >
      <div className="App">
        <Navbar/>
        <Sidebar/>
        <ToastContainer />
        <Switch>
          <Route
            path="/about"
          >
            <AboutPage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

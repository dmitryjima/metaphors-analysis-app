import React, { useEffect } from 'react';

import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

//
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

// Toasts
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import ResultsPage from './pages/results';
import EditionsPagesContainer from './pages/editionsContainer';
import NotFoundPage from './pages/notFoundPage';

// Layout components
import Navbar from './components/layout/navbar';
import Sidebar from './components/layout/sidebar';
import LoginModalDialog from './components/layout/loginModal';

// Redux state
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useTranslation } from 'react-i18next';

import { handleCheckToken } from './slices/userSlice';
import { handleFetchEditions } from './slices/editionsSlice';


// Styled components
import styled from 'styled-components';


// temp
import { _setLoginModalShown } from './slices/uiSlice';

const ApplicationContainer = styled.div`


`


function App() {
  const { t, i18n, ready } = useTranslation();

  const dispatch = useAppDispatch();
  const { editions: editionsState } = useAppSelector(state => state)


  useEffect(() => {
    dispatch(handleFetchEditions());
    dispatch(handleCheckToken());
  }, [])

  if (!ready || editionsState.isEditionsLoading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter
      basename={(i18n.language && i18n.language.length === 2) ? i18n.language : `en`}
    >
      <ApplicationContainer
        onDoubleClick={() => dispatch(_setLoginModalShown(true))}
      >
        <Navbar/>
        <Sidebar/>
        <ToastContainer />
        <Switch>
          <Route
            path="/editions"
          >
            <EditionsPagesContainer />
          </Route>
          <Route
            path="/about"
          >
            <AboutPage />
          </Route>
          <Route
            path="/results"
          >
            <ResultsPage />
          </Route>
          <Route 
            exact 
            path="/"
          >
            <LandingPage />
          </Route>
          <Route
            component={NotFoundPage}
          />
        </Switch>
        <LoginModalDialog/>
      </ApplicationContainer>
    </BrowserRouter>
  );
}

export default App;

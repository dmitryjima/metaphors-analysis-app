import React, { useEffect, useState } from 'react';

import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

//
import { ThemeProvider } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
import SidebarMobile, { SidebarDesktop } from './components/layout/sidebar';
import Footer from './components/layout/footer';
import LoginModalDialog from './components/layout/loginModal';
import LogoutModalDialog from './components/layout/logoutModal';

// Redux state
import { useAppDispatch, useAppSelector } from './app/hooks';
import { useTranslation } from 'react-i18next';

import { handleCheckToken } from './slices/userSlice';
import { handleFetchEditions } from './slices/editionsSlice';


// Stylings
import styled from 'styled-components';
import theme from './theme';

// Utils
import useWindowSize from './utils/useWindowResize';

const ApplicationContainer = styled.div`

`

const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;

  padding: 1rem;

  @media(min-width: 1025px) {
    padding-left: calc(250px + 2rem);
  }
`


function App() {
  const { t, i18n, ready } = useTranslation();

  const dispatch = useAppDispatch();
  const { editions: editionsState } = useAppSelector(state => state)

  const { width } = useWindowSize()

  const [availableLanguages, setAvailableLanguages] = useState<Array<string>>([]);


  useEffect(() => {
    dispatch(handleFetchEditions());
    dispatch(handleCheckToken());
  }, [])

  useEffect(() => {
    let languages: string[] = []

    for (let i in editionsState.editions) {
      if (languages.indexOf(editionsState.editions[i].lang) === -1) {
        languages.push(editionsState.editions[i].lang)
      }
    }

    setAvailableLanguages(availableLanguages => languages)

  }, [editionsState])

  if (!ready || editionsState.isEditionsLoading) {
    return <div>Loading...</div>
  }
  

  return (
    <BrowserRouter
      basename={(i18n.language && i18n.language.length === 2) ? i18n.language : `en`}
    >
      <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ApplicationContainer>
          <Navbar/>
          <ToastContainer />
          {
            width > 1024
            ?
            <SidebarDesktop 
              availableLanguages={availableLanguages}
            />
            :
            <SidebarMobile 
              availableLanguages={availableLanguages}
            />
          }
          <PageContainer>
            <Switch>
              <Route
                path="/editions"
              >
                <EditionsPagesContainer 
                  availableLanguages={availableLanguages}
                />
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
          </PageContainer>
          <Footer />
          <LoginModalDialog/>
          <LogoutModalDialog />
        </ApplicationContainer>  
      </MuiPickersUtilsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

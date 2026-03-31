import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import './css/App.scss';
import DrawerMenu from './components/drawerMenu';
import TopAppBar from './components/topAppBar';
import ErrorBoundary from './components/ErrorBoundary';
import store, { persistor } from './store';
import theme from './theme';
import Home from './views/home';
import Workouts from './views/workouts';
import Workout from './views/workout';
import About from './views/about';
import Profile from './views/profile';
import Exercise from './views/exercise';
import History from './views/history';
import MusicPlayer from './components/musicPlayer';
import Footer from './components/footer';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <div className="App dark-bg">
              <Router>
                <TopAppBar />
                <DrawerMenu />
                <MusicPlayer />
                <Routes>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/workouts/:id/exercise/:exerciseNumber" element={<Exercise />} />
                  <Route path="/workouts/:id" element={<Workout />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Router>
            </div>
            <Footer />
          </ErrorBoundary>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

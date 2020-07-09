import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import './css/App.scss';
import DrawerMenu from "./components/drawerMenu";
import TopAppBar from "./components/topAppBar";
import store from "./store";
import Home from './views/home';
import Workouts from './views/workouts';
import Workout from "./views/workout";
import About from './views/about';
import Profile from './views/profile';
import Test from './views/test';
import Exercise from "./views/exercise";
import MusicPlayer from "./components/musicPlayer";
import Footer from "./components/footer";

const App = () => {
  return (
    <Provider store={store}>
      <div className="App dark-bg">
        <Router>
          <TopAppBar />
          <DrawerMenu />
          <MusicPlayer />
          <Switch>
            <Route path="/profile"><Profile /></Route>
            <Route path="/workouts/:id/exercise/:exerciseNumber" component={Exercise} />
            <Route path="/workouts/:id" component={Workout} />
            <Route path="/workouts"><Workouts /></Route>
            <Route path="/about"><About /></Route>
            <Route path="/test"><Test /></Route>
            <Route path="/"><Home /></Route>
          </Switch>
        </Router>
      </div>
      <Footer />
    </Provider>
  );
};

export default App;

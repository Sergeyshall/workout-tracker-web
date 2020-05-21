import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import './css/App.css';
import DrawerMenu from "./components/drawerMenu";
import TopAppBar from "./components/topAppBar";
import store from "./store";
import Home from './views/home';
import Workouts from './views/workouts';
import About from './views/about';
import Profile from './views/profile';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <TopAppBar />
          <DrawerMenu />
          <Switch>
            <Route path="/profile"><Profile /></Route>
            <Route path="/workouts"><Workouts /></Route>
            <Route path="/about"><About /></Route>
            <Route path="/"><Home /></Route>
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;

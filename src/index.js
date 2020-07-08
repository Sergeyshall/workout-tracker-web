import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { SW_INIT, SW_UPDATE } from "./actions/constants";
import store from "./store";

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.register({
  sendMessageToClient: (message) => {
    console.log(message);
  },
  onSuccess: () => store.dispatch({ type: SW_INIT }),
  onUpdate: reg => store.dispatch({ type: SW_UPDATE, payload: reg }),
});

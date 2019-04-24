import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import configureAnalytics from './ConfigureAnalytics';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'mobx-react';
import RootState from './stores/RootState';

import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';

// Configuration
//window.LOG_LEVEL = 'VERBOSE'; // to turn on detailed logging of Amplify ops
Amplify.configure(awsmobile); // configure Amplify
configureAnalytics();         // configure Amplify analytics

const rootState = new RootState();

// check for current user before rendering, so
// that appState will have current user (or null if none)
rootState.appState.getCurrentUser().then(() => {
  ReactDOM.render(
    <Provider {...rootState}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

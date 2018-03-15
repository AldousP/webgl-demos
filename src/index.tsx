import { applyMiddleware, compose, createStore } from 'redux';
import { HashRouter } from 'react-router-dom';

const APP_SELECTOR = 'app-root';

import 'static/scss/app.scss';
import 'normalize.css/normalize.css';

import * as React from 'react';
import ReactDOM from 'react-dom';
import { effectsMiddleware } from 'redux-effex';
import { persistStore, persistCombineReducers } from 'redux-persist'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react'

import App from '@app/components/containers/app';
import root from '@app/reducers';
import effects from '@app/effects';

let document = window.document;
let composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
let enhancers = composeEnhancers ( applyMiddleware(effectsMiddleware( effects )) );
let store = createStore( root, enhancers );
let persistor = persistStore( store );

ReactDOM.render(
  <Provider store={ store }>
    <PersistGate persistor={ persistor }>
      <HashRouter>
        <App/>
      </HashRouter>
    </PersistGate>
  </Provider>,
  document.getElementById( APP_SELECTOR )
);
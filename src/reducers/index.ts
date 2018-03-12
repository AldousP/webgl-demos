import app from './app';

import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage/index';

const config = {
  key: 'appData',
  version: 2,
  storage
};

const persistRoot = persistCombineReducers(config, {
  app
});

export default persistRoot;

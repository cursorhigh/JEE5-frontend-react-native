// store.js

import { createStore, combineReducers } from 'redux';
import { themeReducer } from './theme';

const rootReducer = combineReducers({
  theme: themeReducer,
});

const store = createStore(rootReducer);

export default store;

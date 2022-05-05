import { createStore, combineReducers } from 'redux';

import initialState from './initialState';
import User from './reducers/user';
import App from './reducers/app';

export default createStore(
  combineReducers({
    User,
    App
  }),
  initialState
);
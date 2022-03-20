import { createStore, combineReducers } from 'redux';

import initialState from './initialState';
import User from './reducers/user';

export default createStore(
  combineReducers({
    User
  }),
  initialState
);
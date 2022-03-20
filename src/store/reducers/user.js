import initialState from '../initialState';
import { USER_LOGIN } from '../actions/user';

const getUserData = (payload) => {
  if (payload) {
    return {
      email: payload.email,
      name: payload.name,
    }
  } else {
    return null
  }
};

const typeMap = {
  [USER_LOGIN]: (state, payload) => ({ ...state, authenticated: true, data: getUserData(payload) }),
};

export default function User(state = initialState, { type, payload }) {
  const reducer = typeMap[type];
  return reducer ? reducer(state, payload) : state
} 
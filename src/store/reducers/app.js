import initialState from '../initialState';
import { APP_SET_ANSWER, APP_RESET_QUIZ, APP_SET_STAMP, APP_SET_RATING } from '../actions/app';

const resetQuiz = () => {
  return {
    experienceRating: 5,
    answer0: 0,
    answer1: 0,
    answer2: 0,
    answer3: 0,
    answer4: 0
  }
};

const typeMap = {
  [APP_SET_ANSWER]: (state, payload) => {
    console.log(`===== Redux:App:APP_SET_ANSWER =====`);
    console.log(JSON.stringify(payload));
    let newState = { ...state };
    if (payload) {
      const questionId = payload.questionId;
      newState.quiz[questionId] = payload.answerIndex;
    }
    console.log(JSON.stringify(newState));
    return newState;
  },
  [APP_SET_STAMP]: (state, payload) => ({ ...state, stamp: payload.base64, shirt: payload.shirtIndex }),
  [APP_RESET_QUIZ]: (state) => ({ ...state, quiz: resetQuiz() }),
  [APP_SET_RATING]: (state, payload) => {
    console.log(`===== Redux:App:APP_SET_RATING =====`);
    console.log(JSON.stringify(payload));
    let newState = { ...state };
    if (payload) {
      newState.quiz['experienceRating'] = payload.rating;
    }
    console.log(JSON.stringify(newState));
    return newState;
  },
};

export default function APP(state = initialState, { type, payload }) {
  const reducer = typeMap[type];
  return reducer ? reducer(state, payload) : state
} 
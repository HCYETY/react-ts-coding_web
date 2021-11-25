import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import showExam from 'useRedux/reducers/showExam';

const allReducer = combineReducers({
  exam: showExam
})

export default createStore(showExam, composeWithDevTools());
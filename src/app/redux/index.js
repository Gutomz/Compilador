import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import VMReducer from './reducers/vm';

export default () => {
  const store = createStore(
    combineReducers({
      vm: VMReducer,
    }),
    compose(applyMiddleware(thunk))
  );

  return store;
};

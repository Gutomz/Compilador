import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import VMReducer from './reducers/vm';
import CompiladorReducer from './reducers/compilador';

export default () => {
  const store = createStore(
    combineReducers({
      vm: VMReducer,
      compilador: CompiladorReducer,
    }),
    compose(applyMiddleware(thunk))
  );

  return store;
};

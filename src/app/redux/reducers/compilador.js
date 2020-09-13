import { VMAction } from '../actions';

const initialState = {
  file: [],
};

export default function compilador(state = initialState, action) {
  switch (action.type) {
    case VMAction.ACTION_SAVE_FILE:
      return {
        ...state,
        file: action.payload,
      };

    default:
      return state;
  }
}

export const getFile = (state) => state.compilador.file;

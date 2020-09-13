import { VMAction } from '../actions';

const initialState = {
  file: [],
  instructionPointer: 0,
  dataPointer: 0,
};

export default function vm(state = initialState, action) {
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

export const getFile = (state) => state.vm && state.vm.file;

import { VMAction } from '../actions';

const initialState = {
  file: [],
  instructionPointer: 0,
  dataPointer: 0,
  programStack: [],
  dataStack: [],
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

export const getInstructionPointer = (state) =>
  state.vm && state.vm.instructionPointer;

export const getDataPointer = (state) => state.vm && state.vm.dataPointer;

export const getProgramStack = (state) => state.vm && state.vm.programStack;

export const getDataStack = (state) => state.vm && state.vm.dataStack;

export const getDataStackByPosition = (state, i) =>
  state.vm && state.vm.dataStack[i];

/* eslint-disable import/no-cycle */
import { VMSelectors } from '../reducers';

export const ACTION_SAVE_FILE = 'vm:ACTION_SAVE_FILE';
export const ACTION_SAVE_INSTRUCTION_POINTER =
  'vm:ACTION_SAVE_INSTRUCTION_POINTER';
export const ACTION_SAVE_DATA_POINTER = 'vm:ACTION_SAVE_DATA_POINTER';
export const ACTION_INSERT_DATA_STACK = 'vm:ACTION_INSERT_DATA_STACK';

export const saveFile = (file) => ({
  type: ACTION_SAVE_FILE,
  payload: file,
});

export const saveInstructionPointer = (value) => ({
  type: ACTION_SAVE_INSTRUCTION_POINTER,
  payload: value,
});

export const saveDataPointer = (value) => ({
  type: ACTION_SAVE_DATA_POINTER,
  payload: value,
});

// Help Functions

export const incrementInstructionPointer = () => (dispatch, getState) => {
  const instructionPointer = VMSelectors.getInstructionPointer(getState());

  dispatch(saveInstructionPointer(instructionPointer + 1));
};

export const decrementInstructionPointer = () => (dispatch, getState) => {
  const instructionPointer = VMSelectors.getInstructionPointer(getState());

  dispatch(saveInstructionPointer(instructionPointer - 1));
};

export const incrementDataPointer = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getInstructionPointer(getState());

  dispatch(saveDataPointer(dataPointer + 1));
};

export const decrementDataPointer = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getInstructionPointer(getState());

  dispatch(saveDataPointer(dataPointer - 1));
};

export const insertDataStack = (value, increment = 0) => (
  dispatch,
  getState
) => {
  const dataPointer = VMSelectors.getInstructionPointer(getState());

  dispatch({
    type: ACTION_INSERT_DATA_STACK,
    payload: { value, position: dataPointer + increment },
  });
};

// Execution Functions

export const execute = () => (dispatch) => {};

export const runStep = () => (dispatch) => {};

export const executeLDC = (k) => (dispatch) => {
  dispatch(incrementDataPointer());
  dispatch(insertDataStack(k));
};

export const executeLDV = (n) => (dispatch, getState) => {
  dispatch(incrementDataPointer());
  dispatch(insertDataStack(VMSelectors.getDataStackByPosition(getState(), n)));
};

// Pegar ponteiro atual da pilha
// const dataPointer = VMSelectors.getInstructionPointer(getState());
// dataPointer - 1 -> dataPointer +  1;

// Pegar valor de uma posição do vetor de dados
// const a = VMSelectors.getDataStackByPosition(getState(), dataPointer - 1)

export const ACTION_SAVE_FILE = 'vm:ACTION_SAVE_FILE';
export const ACTION_SAVE_INSTRUCTION_POINTER = 'vm:ACTION_SAVE_INSTRUCTION_POINTER';
export const ACTION_SAVE_DATA_POINTER = 'vm:ACTION_SAVE_DATA_POINTER';

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

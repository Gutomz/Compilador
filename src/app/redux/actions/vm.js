/* eslint-disable import/no-cycle */
import { message } from 'antd';
import moment from 'moment-timezone';
import { VMSelectors } from '../reducers';

export const ACTION_RESET = 'vm:ACTION_RESET';
export const ACTION_RESTART = 'vm:ACTION_RESTART';
export const ACTION_SAVE_INITIAL_CODE = 'vm:ACTION_SAVE_INITIAL_CODE';
export const ACTION_SAVE_PROGRAM_STACK = 'vm:ACTION_SAVE_PROGRAM_STACK';
export const ACTION_SAVE_INSTRUCTION_POINTER =
  'vm:ACTION_SAVE_INSTRUCTION_POINTER';
export const ACTION_SAVE_DATA_POINTER = 'vm:ACTION_SAVE_DATA_POINTER';
export const ACTION_INSERT_DATA_STACK = 'vm:ACTION_INSERT_DATA_STACK';
export const ACTION_SAVE_WAITING_INPUT = 'vm:ACTION_SAVE_WAITING_INPUT';
export const ACTION_SAVE_EXECUTING = 'vm:ACTION_SAVE_EXECUTING';
export const ACTION_SAVE_RUNNING_EXECUTION = 'vm:ACTION_SAVE_RUNNING_EXECUTION';
export const ACTION_INSERT_CONSOLE_STACK = 'vm:ACTION_INSERT_CONSOLE_STACK';
export const ACTION_SAVE_BREAKPOINTS = 'vm:ACTION_SAVE_BREAKPOINTS';

export const reset = () => ({ type: ACTION_RESET });

export const restart = () => ({ type: ACTION_RESTART });

export const saveInitialCode = (code) => ({
  type: ACTION_SAVE_INITIAL_CODE,
  payload: code,
});

export const saveProgramStack = (array) => ({
  type: ACTION_SAVE_PROGRAM_STACK,
  payload: array,
});

export const saveInstructionPointer = (value) => ({
  type: ACTION_SAVE_INSTRUCTION_POINTER,
  payload: value,
});

export const saveDataPointer = (value) => ({
  type: ACTION_SAVE_DATA_POINTER,
  payload: value,
});

export const saveExecuting = (value) => ({
  type: ACTION_SAVE_EXECUTING,
  payload: value,
});

export const saveRunningExecution = (value) => ({
  type: ACTION_SAVE_RUNNING_EXECUTION,
  payload: value,
});

export const saveBreakpoints = (array) => ({
  type: ACTION_SAVE_BREAKPOINTS,
  payload: array,
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
  const dataPointer = VMSelectors.getDataPointer(getState());

  dispatch(saveDataPointer(dataPointer + 1));
};

export const decrementDataPointer = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());

  dispatch(saveDataPointer(dataPointer - 1));
};

export const insertDataStack = (value, increment = 0) => (
  dispatch,
  getState
) => {
  const dataPointer = VMSelectors.getDataPointer(getState());

  dispatch({
    type: ACTION_INSERT_DATA_STACK,
    payload: { value, index: dataPointer + increment },
  });
};

export const insertConsoleStack = (value) => (dispatch) => {
  dispatch({
    type: ACTION_INSERT_CONSOLE_STACK,
    payload: {
      time: moment().format('HH:mm'),
      message: value,
    },
  });
};

// Execution Functions

export const executeLDC = (k) => (dispatch, getState) => {
  dispatch(incrementDataPointer());
  const dataPointer = VMSelectors.getDataPointer(getState());
  dispatch(insertDataStack({ value: k, index: dataPointer }));
};

export const executeLDV = (n) => (dispatch, getState) => {
  dispatch(incrementDataPointer());
  const dataPointer = VMSelectors.getDataPointer(getState());
  dispatch(
    insertDataStack({
      value: VMSelectors.getDataStackByPosition(getState(), n).value,
      index: dataPointer,
    })
  );
};

export const executeADD = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  );
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );
  const newData = {
    value: lastData.value + actualData.value,
    index: dataPointer - 1,
  };
  dispatch(insertDataStack(newData, -1));
  dispatch(decrementDataPointer());
};

export const executeSUB = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  );
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );
  const newData = {
    value: lastData.value - actualData.value,
    index: dataPointer - 1,
  };
  dispatch(insertDataStack(newData, -1));
  dispatch(decrementDataPointer());
};

export const executeMULT = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  );
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );
  const newData = {
    value: lastData.value * actualData.value,
    index: dataPointer - 1,
  };
  dispatch(insertDataStack(newData, -1));
  dispatch(decrementDataPointer());
};

export const executeDIVI = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  );
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );
  const newData = {
    value: lastData.value / actualData.value,
    index: dataPointer - 1,
  };
  dispatch(insertDataStack(newData, -1));
  dispatch(decrementDataPointer());
};

export const executeINV = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const newData = {
    value: -actualData.value,
    index: dataPointer,
  };
  dispatch(insertDataStack(newData));
};

export const executeAND = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  if (lastData.value === 1 && actualData.value === 1) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeOR = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  if (lastData.value === 1 || actualData.value === 1) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeNEG = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const newData = {
    value: 1 - actualData.value,
    index: dataPointer,
  };
  dispatch(insertDataStack(newData));
};

export const executeCME = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value < actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeCMA = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value > actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeCEQ = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value === actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeCDIF = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value !== actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeCMEQ = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value <= actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeCMAQ = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState()); // s
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  ); // M[s]
  const lastData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer - 1
  ); // M[s - 1]
  if (lastData.value >= actualData.value) {
    dispatch(insertDataStack({ value: 1, index: dataPointer - 1 }, -1));
  } else {
    dispatch(insertDataStack({ value: 0, index: dataPointer - 1 }, -1));
  }
  dispatch(decrementDataPointer());
};

export const executeSTR = (n) => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );

  dispatch(
    insertDataStack({ value: actualData.value, index: n }, n - dataPointer)
  );
  dispatch(decrementDataPointer());
};

export const executeJMP = (p) => (dispatch) => {
  dispatch(saveInstructionPointer(p));
};

export const executeJMPF = (p) => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );

  if (actualData.value === 0) {
    dispatch(saveInstructionPointer(p));
  } else {
    dispatch(incrementInstructionPointer());
  }
  dispatch(decrementDataPointer());
};

export const requestUserInput = () => (dispatch) => {
  dispatch({ type: ACTION_SAVE_WAITING_INPUT, payload: true });
  dispatch(insertConsoleStack('Insira um valor:'));
  message.info('Entre com um valor no terminal');
};

export const executePRN = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );

  dispatch(insertConsoleStack(actualData.value));
  dispatch(decrementDataPointer());
};

export const executeSTART = () => (dispatch) => {
  dispatch(saveDataPointer(-1));
  dispatch(saveExecuting(true));
};

export const executeHLT = () => (dispatch) => {
  dispatch(saveExecuting(false));
  dispatch(saveRunningExecution(false));
};

export const executeALLOC = (m, n) => (dispatch, getState) => {
  for (let k = 0; k < n; k += 1) {
    dispatch(incrementDataPointer());
    const dataPointer = VMSelectors.getDataPointer(getState());
    const data = VMSelectors.getDataStackByPosition(getState(), m + k);
    dispatch(
      insertDataStack({ value: data ? data.value : 0, index: dataPointer })
    );
  }
};

export const executeDALLOC = (m, n) => (dispatch, getState) => {
  for (let k = n - 1; k >= 0; k -= 1) {
    const dataPointer = VMSelectors.getDataPointer(getState());
    const actualData = VMSelectors.getDataStackByPosition(
      getState(),
      dataPointer
    );
    dispatch(
      insertDataStack(
        { value: actualData.value, index: m + k },
        m + k - dataPointer
      )
    );
    dispatch(decrementDataPointer());
  }
};

export const executeCALL = (p) => (dispatch, getState) => {
  dispatch(incrementDataPointer());
  const instructionPointer = VMSelectors.getInstructionPointer(getState());
  const dataPointer = VMSelectors.getDataPointer(getState());
  dispatch(
    insertDataStack({ value: instructionPointer + 1, index: dataPointer })
  );
  dispatch(saveInstructionPointer(p));
};

export const executeRETURN = () => (dispatch, getState) => {
  const dataPointer = VMSelectors.getDataPointer(getState());
  const actualData = VMSelectors.getDataStackByPosition(
    getState(),
    dataPointer
  );
  dispatch(saveInstructionPointer(actualData.value));
  dispatch(decrementDataPointer());
};

export const executeInstruction = () => (dispatch, getState) => {
  const instructionPointer = VMSelectors.getInstructionPointer(getState());
  const instruction = VMSelectors.getProgramStack(getState())[
    instructionPointer
  ];

  switch (instruction.command) {
    case 'START':
      dispatch(executeSTART());
      dispatch(incrementInstructionPointer());
      break;
    case 'LDC':
      dispatch(executeLDC(instruction.var1));
      dispatch(incrementInstructionPointer());
      break;
    case 'LDV':
      dispatch(executeLDV(instruction.var1));
      dispatch(incrementInstructionPointer());
      break;
    case 'ADD':
      dispatch(executeADD());
      dispatch(incrementInstructionPointer());
      break;
    case 'SUB':
      dispatch(executeSUB());
      dispatch(incrementInstructionPointer());
      break;
    case 'MULT':
      dispatch(executeMULT());
      dispatch(incrementInstructionPointer());
      break;
    case 'DIVI':
      dispatch(executeDIVI());
      dispatch(incrementInstructionPointer());
      break;
    case 'INV':
      dispatch(executeINV());
      dispatch(incrementInstructionPointer());
      break;
    case 'AND':
      dispatch(executeAND());
      dispatch(incrementInstructionPointer());
      break;
    case 'OR':
      dispatch(executeOR());
      dispatch(incrementInstructionPointer());
      break;
    case 'NEG':
      dispatch(executeNEG());
      dispatch(incrementInstructionPointer());
      break;
    case 'CME':
      dispatch(executeCME());
      dispatch(incrementInstructionPointer());
      break;
    case 'CMA':
      dispatch(executeCMA());
      dispatch(incrementInstructionPointer());
      break;
    case 'CEQ':
      dispatch(executeCEQ());
      dispatch(incrementInstructionPointer());
      break;
    case 'CDIF':
      dispatch(executeCDIF());
      dispatch(incrementInstructionPointer());
      break;
    case 'CMEQ':
      dispatch(executeCMEQ());
      dispatch(incrementInstructionPointer());
      break;
    case 'CMAQ':
      dispatch(executeCMAQ());
      dispatch(incrementInstructionPointer());
      break;
    case 'STR':
      dispatch(executeSTR(instruction.var1));
      dispatch(incrementInstructionPointer());
      break;
    case 'JMP':
      dispatch(executeJMP(instruction.jumpIndex));
      break;
    case 'JMPF':
      dispatch(executeJMPF(instruction.jumpIndex));
      break;
    case 'RD':
      dispatch(requestUserInput());
      break;
    case 'PRN':
      dispatch(executePRN());
      dispatch(incrementInstructionPointer());
      break;
    case 'ALLOC':
      dispatch(executeALLOC(instruction.var1, instruction.var2));
      dispatch(incrementInstructionPointer());
      break;
    case 'DALLOC':
      dispatch(executeDALLOC(instruction.var1, instruction.var2));
      dispatch(incrementInstructionPointer());
      break;
    case 'CALL':
      dispatch(executeCALL(instruction.jumpIndex));
      break;
    case 'RETURN':
      dispatch(executeRETURN());
      break;
    case 'HLT':
      dispatch(executeHLT());
      break;
    default:
      dispatch(incrementInstructionPointer());
      break;
  }
};

export const execute = () => (dispatch, getState) => {
  dispatch(saveRunningExecution(true));
  const instructionPointer = VMSelectors.getInstructionPointer(getState());

  if (instructionPointer === 0) {
    dispatch(executeInstruction());
  }

  while (VMSelectors.getIsExecuting(getState())) {
    const breakpoints = VMSelectors.getBreakpoints(getState());
    const actualI = VMSelectors.getInstructionPointer(getState());

    if (breakpoints.findIndex((index) => index === actualI) !== -1) {
      dispatch(saveRunningExecution(false));
      break;
    }

    dispatch(executeInstruction());

    const isWaitingUserInput = VMSelectors.getIsWaitingInput(getState());
    if (isWaitingUserInput) break;
  }
};

export const executeRD = (input, isRunningExecution) => (
  dispatch,
  getState
) => {
  dispatch({ type: ACTION_SAVE_WAITING_INPUT, payload: false });
  dispatch(incrementDataPointer());
  const dataPointer = VMSelectors.getDataPointer(getState());
  dispatch(insertDataStack({ value: input, index: dataPointer }));
  dispatch(incrementInstructionPointer());
  dispatch(insertConsoleStack(`Valor inserido: ${input}`));
  if (isRunningExecution) dispatch(execute());
};

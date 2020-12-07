/* eslint-disable import/no-cycle */
import { VMAction } from '../actions';

const initialState = {
  initialCode: '',
  programStack: [],
  instructionPointer: 0,
  dataPointer: 0,
  dataStack: [],
  consoleStack: [],
  isWaitingInput: false,
  isExecuting: false,
  isRunningExecution: false,
  breakpoints: [],
};

export default function vm(state = initialState, action) {
  let newData = [];
  switch (action.type) {
    case VMAction.ACTION_RESET:
      return {
        ...state,
        instructionPointer: 0,
        dataPointer: 0,
        programStack: [],
        dataStack: [],
        consoleStack: [],
        isWaitingInput: false,
        isExecuting: false,
        isRunningExecution: false,
        breakpoints: [],
      };
    case VMAction.ACTION_RESTART:
      return {
        ...state,
        instructionPointer: 0,
        dataPointer: 0,
        dataStack: [],
        consoleStack: [],
        isWaitingInput: false,
        isExecuting: false,
        isRunningExecution: false,
      };
    case VMAction.ACTION_SAVE_PROGRAM_STACK:
      return {
        ...state,
        programStack: action.payload,
      };
    case VMAction.ACTION_SAVE_FILE:
      return {
        ...state,
        file: action.payload,
      };
    case VMAction.ACTION_SAVE_INITIAL_CODE:
      return {
        ...state,
        initialCode: action.payload,
      };
    case VMAction.ACTION_SAVE_WAITING_INPUT:
      return {
        ...state,
        isWaitingInput: action.payload,
      };
    case VMAction.ACTION_INSERT_DATA_STACK:
      newData = state.dataStack.slice();
      newData[action.payload.index] = action.payload.value;
      return {
        ...state,
        dataStack: newData,
      };
    case VMAction.ACTION_SAVE_EXECUTING:
      return {
        ...state,
        isExecuting: action.payload,
      };
    case VMAction.ACTION_SAVE_INSTRUCTION_POINTER:
      return {
        ...state,
        instructionPointer: action.payload,
      };
    case VMAction.ACTION_SAVE_DATA_POINTER:
      return {
        ...state,
        dataPointer: action.payload,
      };
    case VMAction.ACTION_SAVE_RUNNING_EXECUTION:
      return {
        ...state,
        isRunningExecution: action.payload,
      };
    case VMAction.ACTION_INSERT_CONSOLE_STACK:
      newData = state.consoleStack.slice();
      newData.push(action.payload);
      return {
        ...state,
        consoleStack: newData,
      };
    case VMAction.ACTION_SAVE_BREAKPOINTS:
      return {
        ...state,
        breakpoints: action.payload,
      };
    default:
      return state;
  }
}

export const getInitialCode = (state) => state.vm && state.vm.initialCode;

export const getInstructionPointer = (state) =>
  state.vm && state.vm.instructionPointer;

export const getDataPointer = (state) => state.vm && state.vm.dataPointer;

export const getProgramStack = (state) => state.vm && state.vm.programStack;

export const getDataStack = (state) => state.vm && state.vm.dataStack;

export const getConsoleStack = (state) => state.vm && state.vm.consoleStack;

export const getDataStackByPosition = (state, i) =>
  state.vm && state.vm.dataStack[i];

export const getIsWaitingInput = (state) => state.vm && state.vm.isWaitingInput;

export const getIsExecuting = (state) => state.vm && state.vm.isExecuting;

export const getIsRunningExecution = (state) =>
  state.vm && state.vm.isRunningExecution;

export const getBreakpoints = (state) => state.vm && state.vm.breakpoints;

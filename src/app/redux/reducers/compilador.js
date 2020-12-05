import { CompiladorActions } from '../actions';

const initialState = {
  file: null,
  annotations: [],
  generatedCode: '',
};

export default function compilador(state = initialState, action) {
  switch (action.type) {
    case CompiladorActions.ACTION_SAVE_FILE:
      return {
        ...state,
        file: action.payload,
      };
    case CompiladorActions.ACTION_SAVE_ANNOTATIONS:
      return {
        ...state,
        annotations: action.payload,
      };
    case CompiladorActions.ACTION_ADD_ANNOTATIONS:
      return {
        ...state,
        annotations: [...state.annotations, ...action.payload],
      };
    case CompiladorActions.ACTION_CLEAR_ANNOTATIONS:
      return {
        ...state,
        annotations: [],
      };
    case CompiladorActions.ACTION_SAVE_GENERATED_CODE:
      return {
        ...state,
        generatedCode: action.payload,
      };

    default:
      return state;
  }
}

export const getFile = (state) => state.compilador.file;

export const getAnnotations = (state) => state.compilador.annotations;

export const getGeneratedCode = (state) => state.compilador.generatedCode;

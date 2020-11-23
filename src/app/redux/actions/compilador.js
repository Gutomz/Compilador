import { message } from 'antd';
import SyntacticAnalyser from '../../api/syntacticAnalyser';

export const ACTION_SAVE_FILE = 'compiler:ACTION_SAVE_FILE';
export const ACTION_SAVE_ANNOTATIONS = 'compiler:ACTION_SAVE_ANNOTATIONS';
export const ACTION_ADD_ANNOTATIONS = 'compiler:ACTION_ADD_ANNOTATIONS';
export const ACTION_CLEAR_ANNOTATIONS = 'compiler:ACTION_CLEAR_ANNOTATIONS';

export const saveFile = (file) => ({
  type: ACTION_SAVE_FILE,
  payload: file,
});

export const saveAnnotations = (annotations) => ({
  type: ACTION_SAVE_ANNOTATIONS,
  payload: annotations,
});

export const init = (file) => (dispatch) => {
  try {
    console.clear();
    dispatch({ type: ACTION_CLEAR_ANNOTATIONS });
    const syntacticAnalyser = new SyntacticAnalyser(file);

    syntacticAnalyser.init();

    message.success('Finalizou com sucesso');
  } catch (err) {
    console.group('Erro');
    console.log('Motivo: ', err.reason);
    console.log('Linha: ', err.line);

    const error = {
      row: err.line - 1,
      column: 0,
      type: 'error',
    };

    if (err.type === 'lexico') {
      console.log('Index: ', err.index);
      console.log('Caractere: ', err.caractere);
      error.text = `${err.reason} - Caractere (${err.caractere})`;
    } else if (err.type === 'sintatico') {
      console.log(
        'Erro depois do token: ',
        err.lastToken ? err.lastToken : 'Início do arquivo'
      );
      console.log('Token com Erro: ', err.token);
      error.text = `${err.reason}`;
    } else if (err.type === 'semantico') {
      console.log('Token com Erro: ', err.token);
      error.text = `${err.reason} - (${err.token.lexema})`;
    }
    console.groupEnd();

    dispatch(saveAnnotations([error]));
  }
};

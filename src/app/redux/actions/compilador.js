import { message } from 'antd';
import SyntacticAnalyser from '../../api/syntacticAnalyser';

export const ACTION_SAVE_FILE = 'vm:ACTION_SAVE_FILE';

export const saveFile = (file) => ({
  type: ACTION_SAVE_FILE,
  payload: file,
});

export const init = (file) => () => {
  try {
    console.clear();
    const syntacticAnalyser = new SyntacticAnalyser(file);

    syntacticAnalyser.init();

    message.success('Finalizou com sucesso');
  } catch (err) {
    console.group('Erro');
    console.log('Motivo: ', err.reason);
    console.log('Linha: ', err.line);
    if (err.type === 'lexico') {
      console.log('Index: ', err.index);
      console.log('Caractere: ', err.caractere);
    } else if (err.type === 'sintatico') {
      console.log(
        'Erro depois do token: ',
        err.lastToken ? err.lastToken : 'Início do arquivo'
      );
      console.log('Token com Erro: ', err.token);
    }
    console.groupEnd();
  }
};

import SyntacticAnalyser from '../../api/syntacticAnalyser';

export const ACTION_SAVE_FILE = 'vm:ACTION_SAVE_FILE';

export const saveFile = (file) => ({
  type: ACTION_SAVE_FILE,
  payload: file,
});

export const init = (file) => () => {
  try {
    const syntacticAnalyser = new SyntacticAnalyser(file);

    syntacticAnalyser.init();
  } catch (err) {
    console.group('Erro');
    console.log('Motivo: ', err.reason);
    console.log('Linha: ', err.line);
    console.log('Index: ', err.index);
    console.log('Caractere: ', err.caractere);
    console.groupEnd();
  }
};

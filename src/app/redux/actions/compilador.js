import LexicalAnalyser from '../../api/lexicalAnalyser';

export const ACTION_SAVE_FILE = 'vm:ACTION_SAVE_FILE';

export const saveFile = (file) => ({
  type: ACTION_SAVE_FILE,
  payload: file,
});

export const initLexicalAnalyser = (file) => () => {
  const lexicalAnalyser = new LexicalAnalyser(file);

  lexicalAnalyser.init();
};

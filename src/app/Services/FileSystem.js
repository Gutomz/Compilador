const app = window.require('electron').remote;
const fs = app.require('fs');
const { dialog } = app;

export const openFile = async (path, cb) => {
  fs.readFile(
    path,
    'utf8',
    (err, data) =>
      cb &&
      typeof cb === 'function' &&
      cb(err && 'Não foi possível abrir o arquivo', {
        file: data,
        path,
      })
  );
};

export const saveFile = async (path, data, cb) => {
  fs.writeFile(
    path,
    data,
    'utf8',
    (err) =>
      cb &&
      typeof cb === 'function' &&
      cb(err && 'Não foi possível salvar o arquivo', { file: data, path })
  );
};

export const openFileAs = async (filters = [], cb) => {
  const file = await dialog.showOpenDialog({
    title: 'Selecionar Arquivo',
    buttonLabel: 'Selecionar',
    filters,
  });

  if (file.canceled || !file.filePaths || file.filePaths.length === 0) {
    if (cb) cb('Seleção de arquivo cancelada!');
    return;
  }

  openFile(file.filePaths[0], cb);
};

export const saveFileAs = async (data, filters, cb) => {
  const file = await dialog.showSaveDialog({
    title: 'Salvar Como',
    buttonLabel: 'Salvar',
    filters,
  });

  if (file.canceled || !file.filePath) {
    if (cb) cb('Salvamento do arquivo cancelada!');
    return;
  }

  saveFile(file.filePath, data, cb);
};

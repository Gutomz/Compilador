const app = window.require('electron').remote;
const fs = app.require('fs');
const { dialog } = app;

export const openFile = async (cb) => {
  const file = await dialog.showOpenDialog({
    title: 'Selecionar Arquivo',
    buttonLabel: 'Selecionar',
    filters: [{ name: 'Arquivo Texto .txt', extensions: ['txt'] }],
  });

  if (file.canceled || file.filePaths.length === 0) {
    if (cb) cb('Seleção de arquivo cancelada!');
    return;
  }

  fs.readFile(
    file.filePaths[0],
    'utf8',
    (err, data) => cb && cb(err && 'Não foi possível abrir o arquivo', data)
  );
};

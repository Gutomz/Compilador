import React from 'react';

import { Input, Button, Statistic, notification } from 'antd';

const app = window.require('electron').remote;
const fs = app.require('fs');
const { dialog } = app;

class VM extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  onLoadFilePress = async () => {
    const file = await dialog.showOpenDialog({
      title: 'Selecionar Arquivo',
      buttonLabel: 'Selecionar',
      filters: [{ name: 'Arquivo Texto .txt', extensions: ['txt'] }],
    });

    if (file.canceled || file.filePaths.length === 0) {
      console.log('Error ao carregar o arquivo');
      notification.error({
        message: 'Error ao carregar o arquivo',
        placement: 'topRight',
      });
      return;
    }

    fs.readFile(file.filePaths[0], 'utf8', (err, data) => {
      if (err) {
        console.log('Error ao carregar o arquivo');
        return;
      }
      this.setState({ data: data.split('\n') });
      console.log(data.split('\n'));
    });
  };

  render() {
    const { data } = this.state;

    return (
      <div className="vm">
        <div className="vm__inner-view vm__inner-view--first">
          <div className="vm__console-view">
            <div className="vm__console-view__inner" />
          </div>
          <div className="vm__input-view">
            <Input className="vm__input-view__input" />
            <div className="vm__input-view__button">
              <Button>RUN</Button>
              <Button className="vm__input-view__button--margin-left">
                DEBUG
              </Button>
            </div>
          </div>
        </div>
        <div className="vm__inner-view vm__inner-view--second">
          <div className="vm__code-view">
            <div className="vm__code-view__inner">
              {data.map((line) => (
                <p className="vm__code-view__inner__text">{line}</p>
              ))}
            </div>
          </div>
          <div className="vm__input-view">
            <Button onClick={() => this.onLoadFilePress()}>
              Carregar Arquivo
            </Button>
            <div className="vm__input-view__button">
              <Statistic
                title="Registrador de Programa"
                value={0}
                precision={0}
              />
              <Statistic
                className="vm__input-view__button--margin-left"
                title="Topo da Pilha"
                value={0}
                precision={0}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VM;

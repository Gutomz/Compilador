import React from 'react';

import { Input, Button, Statistic, notification, Layout, Row, Col } from 'antd';

const app = window.require('electron').remote;
const fs = app.require('fs');
const { dialog } = app;

const { Sider, Content, Footer } = Layout;

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
        message: 'Erro ao carregar o arquivo',
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
      <Layout>
        <Content className="vm">
          <Layout className="vm">
            <Content className="vm__content">
              <Row className="vm__content--inner" justify="space-between">
                <Col
                  span={12}
                  className="vm__content--inner vm__content--inner--left"
                >
                  <Col className="console custom-scrollbar">
                    <p>Console</p>
                  </Col>
                </Col>
                <Col
                  span={12}
                  className="vm__content--inner vm__content--inner--right"
                >
                  <Col className="code custom-scrollbar">
                    {data.map((line) => (
                      <p className="code__text">{line}</p>
                    ))}
                  </Col>
                </Col>
              </Row>
            </Content>
            <Footer className="vm__footer">
              <Row align="middle">
                <Col span={12} className="vm__content--inner--left">
                  <Row>
                    <Col flex={1}>
                      <Input />
                    </Col>
                    <Button>RUN</Button>
                    <Button>DEBUG</Button>
                  </Row>
                </Col>
                <Col span={12} className="vm__content--inner--right">
                  <Row align="middle" justify="space-between">
                    <Button onClick={() => this.onLoadFilePress()}>
                      Carregar Arquivo
                    </Button>
                    <Col span={16}>
                      <Row justify="space-between">
                        <Statistic
                          title="Registrador de Programa"
                          value={0}
                          precision={0}
                        />
                        <Statistic
                          title="Topo da Pilha"
                          value={0}
                          precision={0}
                        />
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Footer>
          </Layout>
        </Content>
        <Sider style={{ height: '100vh' }} />
      </Layout>
    );
  }
}

export default VM;

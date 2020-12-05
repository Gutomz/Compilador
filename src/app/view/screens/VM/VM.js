import React from 'react';
import { connect } from 'react-redux';
import {
  Input,
  Button,
  Statistic,
  notification,
  Layout,
  Row,
  Col,
  Menu,
} from 'antd';
import { ArrowLeft } from '@material-ui/icons';
import { openFile } from '../../../Services/FileSystem';
import { VMSelectors } from '../../../redux/reducers';
import { VMAction } from '../../../redux/actions';

const { Sider, Content, Footer } = Layout;

class VM extends React.PureComponent {
  onLoadFilePress = () => {
    const { saveFile } = this.props;

    openFile((err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }
      return saveFile(data.split('\n'));
    });
  };

  onSelectMenuOption({ key }) {
    const { history } = this.props;

    switch (key) {
      case 'goBack':
        history.goBack();
        break;
      default:
        break;
    }
  }

  render() {
    const { file } = this.props;

    return (
      <Layout>
        <Menu
          mode="horizontal"
          selectable={false}
          theme="dark"
          onClick={(e) => this.onSelectMenuOption(e)}
        >
          <Menu.Item icon={<ArrowLeft />} key="goBack">
            Voltar
          </Menu.Item>
        </Menu>
        <Layout>
          <Content className="vm">
            <Layout className="vm">
              <Content className="vm__content">
                <Row className="vm__content--inner">
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
                      {file.map((line) => (
                        <p className="code__text">{line}</p>
                      ))}
                    </Col>
                  </Col>
                </Row>
              </Content>
              <Footer className="vm__footer">
                <Row align="middle">
                  <Col span={12} className="vm__footer--inner--left">
                    <Row>
                      <Col flex={1}>
                        <Input />
                      </Col>
                      <Button>RUN</Button>
                      <Button>DEBUG</Button>
                    </Row>
                  </Col>
                  <Col span={12} className="vm__footer--inner--right">
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
          <Sider className="vm__sider" />
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  file: VMSelectors.getFile(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveFile: (file) => dispatch(VMAction.saveFile(file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VM);

import React from 'react';
import { connect } from 'react-redux';
import { Input, Layout, Menu } from 'antd';
import { SendOutlined } from '@material-ui/icons';
import { VMSelectors } from '../../../redux/reducers';
import { VMAction } from '../../../redux/actions';

import InstructionLine from '../../components/instructionLine/InstructionLine';
import StackItem from '../../components/stackItem/StackItem';
import ConsoleItem from '../../components/consoleItem/ConsoleItem';

const { Sider, Content, Footer } = Layout;

class VM extends React.PureComponent {
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
    return (
      <Layout className="vm">
        <Menu
          mode="horizontal"
          selectable={false}
          theme="dark"
          onClick={(e) => this.onSelectMenuOption(e)}
        >
          <Menu.Item key="goBack">Voltar</Menu.Item>
        </Menu>
        <Layout className="vm__content">
          <Content className="vm__content__file">
            <Layout className="vm__content__file__inner">
              <Content className="vm__content__file__content vm__content__card custom-scrollbar">
                <InstructionLine
                  index="0"
                  instruction="Teste"
                  onBreakpointPress={(value) => console.log(value)}
                  current={false}
                />
              </Content>
              <Footer className="vm__content__file__footer">
                {/* <p>infos + buttons</p> */}
                <div className="vm__content__file__footer__instructionPointer vm__content__card">
                  <p>{`I: ${0}`}</p>
                </div>
                <div className="vm__content__file__footer__stackPointer vm__content__card">
                  <p>{`S: ${0}`}</p>
                </div>
                <button
                  className="vm__content__file__footer__button vm__content__card disable-outlines"
                  type="button"
                  onClick={() => console.log('Executar')}
                >
                  EXECUTAR
                </button>
                <button
                  className="vm__content__file__footer__button vm__content__card disable-outlines"
                  type="button"
                  onClick={() => console.log('STEP')}
                >
                  STEP
                </button>
              </Footer>
            </Layout>
          </Content>
          <Content className="vm__content__console">
            <Layout className="vm__content__console__inner">
              <Content className="vm__content__console__content vm__content__card custom-scrollbar">
                <ConsoleItem time="10:52" message="Teste de mensagem padrão" />
              </Content>
              <Footer className="vm__content__console__footer vm__content__card">
                <Input
                  className="vm__content__console__footer__input"
                  bordered={false}
                  onPressEnter={() => console.log('Send Input')}
                />
                <button
                  className="vm__content__console__footer__icon disable-outlines"
                  type="button"
                  onClick={() => console.log('Send Input')}
                >
                  <SendOutlined />
                </button>
              </Footer>
            </Layout>
          </Content>
          <Sider className="vm__content__stack vm__content__card custom-scrollbar">
            <StackItem index="0" value="22" current={false} />
          </Sider>
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

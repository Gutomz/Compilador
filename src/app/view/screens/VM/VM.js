/* eslint-disable no-restricted-globals */
import React from 'react';
import { connect } from 'react-redux';
import { Input, Layout, Menu, notification } from 'antd';
import { SendOutlined } from '@material-ui/icons';
import { VMSelectors } from '../../../redux/reducers';
import { VMAction } from '../../../redux/actions';

import { openFileAs } from '../../../Services/FileSystem';

import InstructionLine from '../../components/instructionLine/InstructionLine';
import StackItem from '../../components/stackItem/StackItem';
import ConsoleItem from '../../components/consoleItem/ConsoleItem';

const { Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

class VM extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  componentDidMount() {
    const { reset, initialCode } = this.props;

    reset();

    if (initialCode) this.generateProgramStack(initialCode);
  }

  onLoadFilePress() {
    const { reset } = this.props;

    openFileAs([{ name: '.asm', extensions: ['asm'] }], (err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }

      reset();

      return this.generateProgramStack(data.file);
    });
  }

  onSelectMenuOption({ key }) {
    const { history, restart } = this.props;

    switch (key) {
      case 'open':
        this.onLoadFilePress();
        break;
      case 'restart':
        restart();
        break;
      case 'goBack':
        history.goBack();
        break;
      default:
        break;
    }
  }

  onInputSubmit() {
    const { setUserInput, isRunningExecution } = this.props;
    const { input } = this.state;

    if (!input || input.trim() === '') {
      return notification.error({
        message: 'Valor inválido!',
        placement: 'topRight',
      });
    }

    const value = parseInt(input, 10);
    if (isNaN(value)) {
      return notification.error({
        message: 'Valor inválido!',
        placement: 'topRight',
      });
    }

    return this.setState({ input: '' }, () => {
      setUserInput(value, isRunningExecution);
    });
  }

  onBreakpointPress(index, active) {
    const { breakpoints, saveBreakpoints } = this.props;
    const newBreakpoints = breakpoints.slice();
    if (active) {
      newBreakpoints.push(index);
    } else {
      newBreakpoints.splice(
        newBreakpoints.findIndex((x) => x === index),
        1
      );
    }
    saveBreakpoints(newBreakpoints);
  }

  generateProgramStack(code) {
    const { saveProgramStack } = this.props;

    const instructions = code.split('\n');

    const programStack = [];

    instructions
      .filter((x) => !!x)
      .forEach((instruction, index) => {
        const instructionSlipt = instruction.split(' ');
        const command = instructionSlipt[0];
        switch (command) {
          case 'START':
          case 'ADD':
          case 'SUB':
          case 'MULT':
          case 'DIVI':
          case 'INV':
          case 'AND':
          case 'OR':
          case 'NEG':
          case 'CME':
          case 'CMA':
          case 'CEQ':
          case 'CDIF':
          case 'CMEQ':
          case 'CMAQ':
          case 'RD':
          case 'PRN':
          case 'RETURN':
          case 'HLT':
            programStack.push({
              command: command.trim(),
              index,
              original: instruction,
            });
            break;
          case 'LDC':
          case 'LDV':
          case 'STR':
            programStack.push({
              command: command.trim(),
              var1: parseInt(instructionSlipt[1].trim(), 10),
              index,
              original: instruction,
            });
            break;
          case 'ALLOC':
          case 'DALLOC':
            programStack.push({
              command: command.trim(),
              var1: parseInt(instructionSlipt[1].split(',')[0].trim(), 10),
              var2: parseInt(instructionSlipt[1].split(',')[1].trim(), 10),
              index,
              original: instruction,
            });
            break;
          case 'JMP':
          case 'JMPF':
          case 'CALL':
            programStack.push({
              command: command.trim(),
              jumpIndex: instructionSlipt[1].trim(),
              index,
              original: instruction,
            });
            break;
          default:
            programStack.push({
              command: instructionSlipt[1].trim(),
              label: command.trim(),
              index,
              original: instruction,
            });
            break;
        }
      });

    for (let i = 0; i < programStack.length; i += 1) {
      if (programStack[i].jumpIndex) {
        programStack[i].jumpIndex = programStack.findIndex(
          (x) => x.label === programStack[i].jumpIndex
        );
      }
    }

    saveProgramStack(programStack);
  }

  render() {
    const {
      instructionPointer,
      dataPointer,
      programStack,
      dataStack,
      consoleStack,
      isWaitingInput,
      executeInstruction,
      isExecuting,
      isRunningExecution,
      runExecution,
    } = this.props;

    const { input } = this.state;

    return (
      <Layout className="vm">
        <Menu
          mode="horizontal"
          selectable={false}
          theme="dark"
          onClick={(e) => this.onSelectMenuOption(e)}
        >
          <SubMenu key="file" title="Arquivo">
            <Menu.Item key="open">Abrir</Menu.Item>
          </SubMenu>
          <SubMenu key="execution" title="Execução">
            <Menu.Item key="restart">Reiniciar</Menu.Item>
          </SubMenu>
          <Menu.Item key="goBack">Editor</Menu.Item>
        </Menu>
        <Layout className="vm__content">
          <Content className="vm__content__file">
            <Layout className="vm__content__file__inner">
              <Content className="vm__content__file__content vm__content__card custom-scrollbar">
                {programStack.map((instruction, index) => (
                  <InstructionLine
                    key={index.toString()}
                    index={index}
                    instruction={instruction.original}
                    onBreakpointPress={(value) =>
                      this.onBreakpointPress(instruction.index, value)
                    }
                    current={instructionPointer === index}
                  />
                ))}
                {programStack.length === 0 ? (
                  <p className="vm__content__emptyText">
                    Selecione um arquivo .asm para executar...
                  </p>
                ) : null}
              </Content>
              <Footer className="vm__content__file__footer">
                <div className="vm__content__file__footer__instructionPointer vm__content__card">
                  <p>{`I: ${instructionPointer}`}</p>
                </div>
                <div className="vm__content__file__footer__stackPointer vm__content__card">
                  <p>{`S: ${dataPointer}`}</p>
                </div>
                <button
                  className="vm__content__file__footer__button vm__content__card disable-outlines"
                  type="button"
                  onClick={() => runExecution()}
                  disabled={
                    programStack.length === 0 ||
                    isRunningExecution ||
                    isWaitingInput
                  }
                >
                  EXECUTAR
                </button>
                <button
                  className="vm__content__file__footer__button vm__content__card disable-outlines"
                  type="button"
                  onClick={() => executeInstruction()}
                  disabled={
                    programStack.length === 0 ||
                    isRunningExecution ||
                    isWaitingInput
                  }
                >
                  STEP
                </button>
              </Footer>
            </Layout>
          </Content>
          <Content className="vm__content__console">
            <Layout className="vm__content__console__inner">
              <Content className="vm__content__console__content vm__content__card custom-scrollbar">
                {consoleStack.map((item, index) => (
                  <ConsoleItem
                    key={index.toString()}
                    time={item.time}
                    message={item.message}
                  />
                ))}
                {consoleStack.length === 0 ? (
                  <p className="vm__content__emptyText">
                    Nenhum dado para mostrar...
                  </p>
                ) : null}
              </Content>
              <Footer className="vm__content__console__footer vm__content__card">
                <Input
                  className="vm__content__console__footer__input"
                  bordered={false}
                  value={input}
                  onChange={(e) => this.setState({ input: e.target.value })}
                  onPressEnter={() => this.onInputSubmit()}
                  placeholder="Entrada de dados..."
                  disabled={!isWaitingInput}
                />
                <button
                  className="vm__content__console__footer__icon disable-outlines"
                  type="button"
                  onClick={() => this.onInputSubmit()}
                  disabled={!isWaitingInput}
                >
                  <SendOutlined />
                </button>
              </Footer>
            </Layout>
          </Content>
          <Sider className="vm__content__stack vm__content__card custom-scrollbar">
            {dataStack
              .slice()
              .reverse()
              .map(
                (item) =>
                  item &&
                  ((isExecuting && item.index <= dataPointer) ||
                    !isExecuting) && (
                    <StackItem
                      key={item.index.toString()}
                      index={item.index}
                      value={item.value}
                    />
                  )
              )}
            {dataStack.length === 0 ? (
              <p className="vm__content__emptyText">Pilha de dados vazia.</p>
            ) : null}
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  initialCode: VMSelectors.getInitialCode(state),
  instructionPointer: VMSelectors.getInstructionPointer(state),
  dataPointer: VMSelectors.getDataPointer(state),
  programStack: VMSelectors.getProgramStack(state),
  dataStack: VMSelectors.getDataStack(state),
  consoleStack: VMSelectors.getConsoleStack(state),
  isWaitingInput: VMSelectors.getIsWaitingInput(state),
  isExecuting: VMSelectors.getIsExecuting(state),
  isRunningExecution: VMSelectors.getIsRunningExecution(state),
  breakpoints: VMSelectors.getBreakpoints(state),
});

const mapDispatchToProps = (dispatch) => ({
  reset: () => dispatch(VMAction.reset()),
  restart: () => dispatch(VMAction.restart()),
  saveProgramStack: (array) => dispatch(VMAction.saveProgramStack(array)),
  executeInstruction: () => dispatch(VMAction.executeInstruction()),
  runExecution: () => dispatch(VMAction.execute()),
  setUserInput: (input, isRunningExecution) =>
    dispatch(VMAction.executeRD(input, isRunningExecution)),
  saveBreakpoints: (array) => dispatch(VMAction.saveBreakpoints(array)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VM);

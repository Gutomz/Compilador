import React from 'react';
import { connect } from 'react-redux';
import { notification, Menu } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-dracula';

import { saveFile, openFileAs, saveFileAs } from '../../../Services/FileSystem';
import { CompiladorActions, VMAction } from '../../../redux/actions';
import { CompiladorSelectors } from '../../../redux/reducers';

const { SubMenu } = Menu;

class Compilador extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      file: '',
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const { fileData } = this.props;

    if (fileData) {
      this.setState({ file: fileData.file });
    }
  }

  onLoadFilePress() {
    const { saveFileData, init } = this.props;

    openFileAs([{ name: '.txt', extensions: ['txt'] }], (err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }

      return this.setState({ file: data.file }, () => {
        saveFileData(data);
        if (data.file !== '' || data.file.trim() !== '') init(data.file);
      });
    });
  }

  onSaveFilePress(newFile) {
    const { fileData, saveFileData, init } = this.props;
    const { file } = this.state;

    if (!fileData && !newFile) return null;

    const cb = (err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }

      saveFileData(data);

      if (data.file !== '' || data.file.trim() !== '') init(file);

      return null;
    };

    if (newFile) {
      return saveFileAs(file, [{ name: '.txt', extensions: ['txt'] }], cb);
    }

    return saveFile(fileData.path, file, cb);
  }

  onSaveAssemblyFilePress(newFile) {
    const { generatedCode, fileData } = this.props;

    console.log(fileData.path);

    const cb = (err) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }

      return notification.success({
        message: 'Arquivo assembly salvo com sucesso!',
        placement: 'topRight',
      });
    };

    if (!newFile) {
      return saveFile(
        `${fileData.path}`.replace('.txt', '.asm'),
        generatedCode,
        cb
      );
    }

    return saveFileAs(
      generatedCode,
      [{ name: '.asm', extensions: ['asm'] }],
      cb
    );
  }

  onNewPress() {
    const { saveFileData } = this.props;
    this.setState({ file: '' }, () => saveFileData(null));
  }

  onSelectMenuOption({ key }) {
    const {
      history,
      cleanGeneratedCode,
      generatedCode,
      saveGeneratedCodeToVM,
    } = this.props;

    switch (key) {
      case 'open':
        cleanGeneratedCode();
        this.onLoadFilePress();
        break;
      case 'save':
        cleanGeneratedCode();
        this.onSaveFilePress();
        break;
      case 'saveAs':
        cleanGeneratedCode();
        this.onSaveFilePress(true);
        break;
      case 'new':
        cleanGeneratedCode();
        this.onNewPress();
        break;
      case 'saveAssembly':
        this.onSaveAssemblyFilePress();
        break;
      case 'saveAsAssembly':
        this.onSaveAssemblyFilePress(true);
        break;
      case 'runAssembly':
      case 'vm':
        saveGeneratedCodeToVM(generatedCode);
        history.push('/vm');
        break;
      default:
        break;
    }
  }

  getFileName = (fileData) => {
    return fileData
      ? `Editando o arquivo ${fileData.path.split('\\').pop()}`
      : 'Novo Documento';
  };

  handleKeyDown(event) {
    const charCode = String.fromCharCode(event.which).toLowerCase();
    if (event.ctrlKey && charCode === 's') {
      event.preventDefault();
      const { fileData } = this.props;

      this.onSaveFilePress(!fileData);
    }
  }

  render() {
    const { fileData, annotations, generatedCode } = this.props;
    const { file } = this.state;

    return (
      <div
        className="compiler"
        onKeyDown={this.handleKeyDown}
        role="presentation"
      >
        <Menu
          mode="horizontal"
          selectable={false}
          theme="dark"
          onClick={(e) => this.onSelectMenuOption(e)}
        >
          <SubMenu key="file" title="Arquivo">
            <Menu.Item key="new">Novo</Menu.Item>
            <Menu.Item key="open">Abrir</Menu.Item>
            <Menu.Item key="save" disabled={!fileData}>
              Salvar
            </Menu.Item>
            <Menu.Item key="saveAs">Salvar Como</Menu.Item>
          </SubMenu>
          <SubMenu key="assembly" title="Assembly" disabled={!generatedCode}>
            <Menu.Item key="saveAssembly">Salvar</Menu.Item>
            <Menu.Item key="saveAsAssembly">Salvar Como</Menu.Item>
            <Menu.Item key="runAssembly">Executar</Menu.Item>
          </SubMenu>
          <Menu.Item key="vm">Máquina Virtual</Menu.Item>
        </Menu>
        <AceEditor
          mode="plain_text"
          theme="dracula"
          height="100%"
          width="100%"
          className="compiler__text-editor"
          onChange={(value) => this.setState({ file: value })}
          value={file}
          name="text-editor"
          annotations={annotations}
          setOptions={{
            useWorker: false,
            tabSize: 2,
            selectionStyle: 'text',
            showInvisibles: false,
            showPrintMargin: false,
            fixedWidthGutter: true,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
          }}
        />
        <div className="compiler__footer">
          <p>
            {this.getFileName(fileData)}
            {(!fileData || (fileData && fileData.file !== file)) && '*'}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fileData: CompiladorSelectors.getFile(state),
  annotations: CompiladorSelectors.getAnnotations(state),
  generatedCode: CompiladorSelectors.getGeneratedCode(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveFileData: (file) => dispatch(CompiladorActions.saveFile(file)),
  init: (file) => dispatch(CompiladorActions.init(file)),
  cleanGeneratedCode: () =>
    dispatch({
      type: CompiladorActions.ACTION_SAVE_GENERATED_CODE,
      payload: null,
    }),
  saveGeneratedCodeToVM: (data) => dispatch(VMAction.saveInitialCode(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compilador);

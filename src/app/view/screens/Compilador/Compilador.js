import React from 'react';
import { connect } from 'react-redux';
import { notification, Menu } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-plain_text';
import 'ace-builds/src-noconflict/theme-dracula';

import { saveFile, openFileAs, saveFileAs } from '../../../Services/FileSystem';
import { CompiladorActions } from '../../../redux/actions';
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

  onLoadFilePress() {
    const { saveFileData, init } = this.props;

    openFileAs((err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }

      return this.setState({ file: data.file }, () => {
        saveFileData(data);
        init(data.file);
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

      init(file);

      return notification.success({
        message: 'Arquivo salvo!',
        placement: 'topRight',
      });
    };

    if (newFile) {
      return saveFileAs(file, cb);
    }

    return saveFile(fileData.path, file, cb);
  }

  onNewPress() {
    const { saveFileData } = this.props;
    this.setState({ file: '' }, () => saveFileData(null));
  }

  onSelectMenuOption({ key }) {
    switch (key) {
      case 'open':
        this.onLoadFilePress();
        break;
      case 'save':
        this.onSaveFilePress();
        break;
      case 'saveAs':
        this.onSaveFilePress(true);
        break;
      case 'new':
        this.onNewPress();
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
    const { fileData, annotations } = this.props;
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
});

const mapDispatchToProps = (dispatch) => ({
  saveFileData: (file) => dispatch(CompiladorActions.saveFile(file)),
  init: (file) => dispatch(CompiladorActions.init(file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compilador);

import React from 'react';
import { connect } from 'react-redux';
import { Button, notification } from 'antd';
import { openFile } from '../../../Services/FileSystem';
import { CompiladorActions } from '../../../redux/actions';
import { CompiladorSelectors } from '../../../redux/reducers';

class Compilador extends React.PureComponent {
  onLoadFilePress = () => {
    const { saveFile } = this.props;

    openFile((err, data) => {
      if (err) {
        return notification.error({
          message: err,
          placement: 'topRight',
        });
      }
      return saveFile(data);
    });
  };

  render() {
    const { file, initLexicalAnalyser } = this.props;
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Button onClick={() => this.onLoadFilePress()}>Carregar arquivo</Button>
        <Button onClick={() => initLexicalAnalyser(file)}>Iniciar</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  file: CompiladorSelectors.getFile(state),
});

const mapDispatchToProps = (dispatch) => ({
  saveFile: (file) => dispatch(CompiladorActions.saveFile(file)),
  initLexicalAnalyser: (file) =>
    dispatch(CompiladorActions.initLexicalAnalyser(file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Compilador);

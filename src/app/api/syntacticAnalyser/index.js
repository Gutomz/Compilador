import LexicalAnalyser from '../lexicalAnalyser';
import { ErrorType, SymbolsType } from '../../enum/token';

export default class SyntacticAnalyser {
  constructor(file) {
    this.lexicalAnalyser = new LexicalAnalyser(file);
    this.line = 1;
  }

  readToken() {
    try {
      const token = this.lexicalAnalyser.readToken();
      this.line = token.line;
      return token;
    } catch (err) {
      const error = new Error(err.reason);
      Object.assign(error, err);
      throw error;
    }
  }

  Error(reason) {
    const error = new Error(reason);
    error.line = this.line;
    error.reason = reason;

    throw error;
  }

  init() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.PROGRAMA) {
      token = this.readToken();
      if (token.simbolo === SymbolsType.IDENTIFICADOR) {
        console.log('Continua ai');
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    } else {
      this.Error(ErrorType.MISSING_PROGRAM);
    }
  }
}

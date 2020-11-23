import { ErrorType, SymbolsType } from '../../enum/token';

export default class LexicalAnalyser {
  constructor(file) {
    this.file = file;
    this.index = 0;
    this.line = 1;
    this.eof = file.length;
    this.tokens = [];
    this.error = null;

    this.eol = /\n/;
    this.letters = /^[A-Za-z]+$/;
    this.digits = /^\d+$/;
    this.assignment = /[:]/;
    this.arithmeticOperator = /[*+-]/;
    this.relationalOperator = /[<>=!]/;
    this.punctuations = /[;,().]/;
  }

  removeUselessData() {
    const { file, eof } = this;
    while (
      this.index < eof &&
      (file[this.index] === '{' ||
        file[this.index] === '/' ||
        file[this.index] === ' ')
    ) {
      if (file[this.index] === '{') {
        const error = {
          line: this.line,
          caractere: file[this.index],
          index: this.index,
          reason: '',
        };

        do {
          this.index += 1;
          if (file[this.index] === '\n') {
            this.line += 1;
            this.index += 1;
          }
        } while (this.index < eof && file[this.index] !== '}');

        if (this.index === eof) {
          error.reason = ErrorType.MISSING_CLOSE_BRACE;
          return error;
        }

        this.index += 1;
      }

      if (this.index < eof && file[this.index] === '/') {
        const error = {
          line: this.line,
          caractere: file[this.index],
          index: this.index,
        };

        this.index += 1;

        if (this.index < eof && file[this.index] === '*') {
          error.caractere += file[this.index];

          let endComment = false;
          do {
            this.index += 1;

            if (file[this.index] === '\n') {
              this.line += 1;
              this.index += 1;
            }

            if (file[this.index] === '*') {
              this.index += 1;
              if (file[this.index] === '/') {
                endComment = true;
              }
            }
          } while (this.index < eof && !endComment);

          if (this.index === eof) {
            error.reason = ErrorType.MISSING_CLOSE_COMMENT;
            return error;
          }

          this.index += 1;
        } else {
          error.reason = ErrorType.MISSING_STAR;
          return error;
        }
      }
      while (this.index < eof && file[this.index] === ' ') {
        this.index += 1;
      }
    }

    return null;
  }

  treatDigit() {
    const { file, eof, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: SymbolsType.DIGITO,
      line,
    };

    this.index += 1;

    while (file[this.index] < eof && this.digits.test(file[this.index])) {
      token.lexema += file[this.index];
      this.index += 1;
    }

    return token;
  }

  treatLetter() {
    const { file, eof, digits, letters, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
      line,
    };

    this.index += 1;
    while (
      this.index < eof &&
      (digits.test(file[this.index]) ||
        letters.test(file[this.index]) ||
        file[this.index] === '_')
    ) {
      token.lexema += file[this.index];
      this.index += 1;
    }
    switch (token.lexema) {
      case 'programa':
        token.simbolo = SymbolsType.PROGRAMA;
        break;
      case 'se':
        token.simbolo = SymbolsType.SE;
        break;
      case 'entao':
        token.simbolo = SymbolsType.ENTAO;
        break;
      case 'senao':
        token.simbolo = SymbolsType.SENAO;
        break;
      case 'enquanto':
        token.simbolo = SymbolsType.ENQUANTO;
        break;
      case 'faca':
        token.simbolo = SymbolsType.FACA;
        break;
      case 'inicio':
        token.simbolo = SymbolsType.INICIO;
        break;
      case 'fim':
        token.simbolo = SymbolsType.FIM;
        break;
      case 'escreva':
        token.simbolo = SymbolsType.ESCREVA;
        break;
      case 'leia':
        token.simbolo = SymbolsType.LEIA;
        break;
      case 'var':
        token.simbolo = SymbolsType.VAR;
        break;
      case 'inteiro':
        token.simbolo = SymbolsType.INTEIRO;
        break;
      case 'booleano':
        token.simbolo = SymbolsType.BOOLEANO;
        break;
      case 'verdadeiro':
        token.simbolo = SymbolsType.VERDADEIRO;
        break;
      case 'falso':
        token.simbolo = SymbolsType.FALSO;
        break;
      case 'procedimento':
        token.simbolo = SymbolsType.PROCEDIMENTO;
        break;
      case 'funcao':
        token.simbolo = SymbolsType.FUNCAO;
        break;
      case 'div':
        token.simbolo = SymbolsType.DIV;
        break;
      case 'e':
        token.simbolo = SymbolsType.E;
        break;
      case 'ou':
        token.simbolo = SymbolsType.OU;
        break;
      case 'nao':
        token.simbolo = SymbolsType.NAO;
        break;

      default:
        token.simbolo = SymbolsType.IDENTIFICADOR;
        break;
    }

    return token;
  }

  treatAssignment() {
    const { file, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: SymbolsType.DOISPONTOS,
      line,
    };
    this.index += 1;
    if (file[this.index] === '=') {
      token.lexema += file[this.index];
      token.simbolo = SymbolsType.ATRIBUICAO;
      this.index += 1;
    }
    return token;
  }

  treatArithmeticOperator() {
    const { file, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
      line,
    };

    switch (file[this.index]) {
      case '+':
        token.simbolo = SymbolsType.MAIS;
        break;
      case '-':
        token.simbolo = SymbolsType.MENOS;
        break;
      case '*':
        token.simbolo = SymbolsType.MULTI;
        break;
      default:
        break;
    }
    this.index += 1;
    return token;
  }

  treatRelationalOperator() {
    const { file, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
      line,
    };
    let error = null;

    if (file[this.index] === '>') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = SymbolsType.MAIORIGUAL;
        this.index += 1;
      } else {
        token.simbolo = SymbolsType.MAIOR;
      }
    } else if (file[this.index] === '<') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = SymbolsType.MENORIGUAL;
        this.index += 1;
      } else {
        token.simbolo = SymbolsType.MENOR;
      }
    } else if (file[this.index] === '!') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = SymbolsType.DIFERENTE;
        this.index += 1;
      } else {
        error = {
          caractere: file[this.index - 1],
          index: this.index,
          line: this.line,
        };
      }
    } else if (file[this.index] === '=') {
      this.index += 1;
      token.simbolo = SymbolsType.IGUAL;
    }
    return { token, error };
  }

  treatPunctuation() {
    const { file, line } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
      line,
    };

    switch (file[this.index]) {
      case ';':
        token.simbolo = SymbolsType.PONTOVIRGULA;
        break;
      case ',':
        token.simbolo = SymbolsType.VIRGULA;
        break;
      case '(':
        token.simbolo = SymbolsType.ABREPARENTESES;
        break;
      case ')':
        token.simbolo = SymbolsType.FECHAPARENTESES;
        break;
      case '.':
        token.simbolo = SymbolsType.PONTO;
        break;
      default:
        break;
    }
    this.index += 1;
    return token;
  }

  getToken() {
    const { index, file } = this;
    const caractere = file[index];
    let token = null;
    let error = null;

    if (this.digits.test(caractere)) {
      token = this.treatDigit();
    } else if (this.letters.test(caractere)) {
      token = this.treatLetter();
    } else if (this.assignment.test(caractere)) {
      token = this.treatAssignment();
    } else if (this.arithmeticOperator.test(caractere)) {
      token = this.treatArithmeticOperator();
    } else if (this.relationalOperator.test(caractere)) {
      const { token: _token, error: _error } = this.treatRelationalOperator();
      error = _error;
      token = _token;
    } else if (this.punctuations.test(caractere)) {
      token = this.treatPunctuation();
    } else if (caractere.charCodeAt(0) === 13) {
      this.line += 1;
      this.index += 2;
    } else if (caractere.charCodeAt(0) === 10) {
      this.line += 1;
      this.index += 1;
    } else {
      error = {
        caractere,
        index,
        line: this.line,
        reason: ErrorType.INVALID_CARACTERE,
      };
    }

    return {
      token,
      error,
    };
  }

  readToken() {
    while (this.index < this.eof) {
      const uselessDataError = this.removeUselessData();
      if (uselessDataError) {
        const err = new Error(uselessDataError.reason);
        Object.assign(err, uselessDataError);
        throw err;
      }

      if (this.index < this.eof) {
        const { token, error } = this.getToken();

        if (error) {
          const err = new Error();
          Object.assign(err, error);
          throw err;
        }

        if (token) {
          return token;
        }
      }
    }

    return this.eof;
  }
}

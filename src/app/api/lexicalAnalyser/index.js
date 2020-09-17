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
        do {
          this.index += 1;
        } while (this.index < eof && file[this.index] !== '}');
        this.index += 1;
      }

      if (this.index < eof && file[this.index] === '/') {
        this.index += 1;
        if (this.index < eof && file[this.index] === '*') {
          this.index += 1;
          let endComment = false;
          do {
            if (file[this.index] === '*') {
              this.index += 1;
              if (file[this.index] === '/') {
                endComment = true;
              }
            }
            this.index += 1;
          } while (this.index < eof && !endComment);
        } else {
          return {
            line: this.line,
            caractere: file[this.index],
            index: this.index,
          };
        }
      }
      while (this.index < eof && file[this.index] === ' ') {
        this.index += 1;
      }
    }

    return null;
  }

  treatDigit() {
    const { file, eof } = this;
    const token = {
      lexema: file[this.index],
      simbolo: 'sdigito',
    };

    this.index += 1;

    while (file[this.index] < eof && this.digits.test(file[this.index])) {
      token.lexema += file[this.index];
      this.index += 1;
    }

    return token;
  }

  treatLetter() {
    const { file, eof, digits, letters } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
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
        token.simbolo = 'sprograma';
        break;
      case 'se':
        token.simbolo = 'sse';
        break;
      case 'entao':
        token.simbolo = 'sentao';
        break;
      case 'senao':
        token.simbolo = 'ssenao';
        break;
      case 'enquanto':
        token.simbolo = 'senquanto';
        break;
      case 'faca':
        token.simbolo = 'sfaca';
        break;
      case 'inicio':
        token.simbolo = 'sinicio';
        break;
      case 'fim':
        token.simbolo = 'sfim';
        break;
      case 'escreva':
        token.simbolo = 'sescreva';
        break;
      case 'leia':
        token.simbolo = 'sleia';
        break;
      case 'var':
        token.simbolo = 'svar';
        break;
      case 'inteiro':
        token.simbolo = 'sinteiro';
        break;
      case 'booleano':
        token.simbolo = 'sbooleano';
        break;
      case 'verdadeiro':
        token.simbolo = 'sverdadeiro';
        break;
      case 'falso':
        token.simbolo = 'sfalso';
        break;
      case 'procedimento':
        token.simbolo = 'sprocedimento';
        break;
      case 'funcao':
        token.simbolo = 'sfuncao';
        break;
      case 'div':
        token.simbolo = 'sdiv';
        break;
      case 'e':
        token.simbolo = 'se';
        break;
      case 'ou':
        token.simbolo = 'sou';
        break;
      case 'nao':
        token.simbolo = 'snao';
        break;

      default:
        token.simbolo = 'sidentificador';
        break;
    }

    return token;
  }

  treatAssignment() {
    const { file } = this;
    const token = {
      lexema: file[this.index],
      simbolo: 'sdoispontos',
    };
    this.index += 1;
    if (file[this.index] === '=') {
      token.lexema += file[this.index];
      token.simbolo = 'satribuicao';
      this.index += 1;
    }
    return token;
  }

  treatArithmeticOperator() {
    const { file } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
    };

    switch (file[this.index]) {
      case '+':
        token.simbolo = 'smais';
        break;
      case '-':
        token.simbolo = 'smenos';
        break;
      case '*':
        token.simbolo = 'smulti';
        break;
      default:
        break;
    }
    this.index += 1;
    return token;
  }

  treatRelationalOperator() {
    const { file } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
    };
    let error = null;

    if (file[this.index] === '>') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = 'smaiorigual';
        this.index += 1;
      } else {
        token.simbolo = 'smaior';
      }
    } else if (file[this.index] === '<') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = 'smenorigual';
        this.index += 1;
      } else {
        token.simbolo = 'smenor';
      }
    } else if (file[this.index] === '!') {
      this.index += 1;
      if (file[this.index] === '=') {
        token.lexema += file[this.index];
        token.simbolo = 'sdiferente';
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
      token.simbolo = 'sigual';
    }
    return { token, error };
  }

  treatPunctuation() {
    const { file } = this;
    const token = {
      lexema: file[this.index],
      simbolo: '',
    };

    switch (file[this.index]) {
      case ';':
        token.simbolo = 'spontoVirgula';
        break;
      case ',':
        token.simbolo = 'svirgula';
        break;
      case '(':
        token.simbolo = 'sabreParenteses';
        break;
      case ')':
        token.simbolo = 'sfechaParenteses';
        break;
      case '.':
        token.simbolo = 'sponto';
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
    } else {
      error = {
        caractere,
        index,
        line: this.line,
      };
    }

    return {
      token,
      error,
    };
  }

  init() {
    while (this.index < this.eof) {
      const uselessDataError = this.removeUselessData();
      if (uselessDataError) {
        this.error = uselessDataError;
        break;
      }

      if (this.index < this.eof) {
        const { token, error } = this.getToken();

        if (error) {
          this.error = error;
          break;
        }
        if (token) {
          this.tokens.push(token);
        }
      }
    }

    console.group('Resultado');
    console.group('File');
    console.log(this.file);
    console.groupEnd();
    console.log('index', this.index);
    console.log('lines', this.line);
    console.log('eof', this.eof);
    console.log('Tokens', this.tokens);
    console.log('Error', this.error);
    console.groupEnd();
  }
}

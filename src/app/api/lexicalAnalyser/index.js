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
    this.relationalOperator = /[<>=]/;
    this.punctuations = /[;,().]/;
  }

  removeUselessData() {
    const { file, eof } = this;
    while (
      this.index < eof &&
      (file[this.index] === '{' || file[this.index] === '/')
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
          return {};
        }
      }
    }
    while (this.index < eof && file[this.index] === ' ') {
      this.index += 1;
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
    const { file } = this;

    let mixOfLetters = file[this.index];

    this.index += 1;

    while (file[this.index] === 'a') {
      mixOfLetters += file[this.index];
      this.index += 1;
    }
    return mixOfLetters;
  }

  treatAssignment() {
    return this.error;
  }

  treatArithmeticOperator() {
    return this.error;
  }

  treatRelationalOperator() {
    return this.error;
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
      const { _token, _error } = this.treatAssignment();
      error = _error;
      token = _token;
    } else if (this.arithmeticOperator.test(caractere)) {
      const { _token, _error } = this.treatArithmeticOperator();
      error = _error;
      token = _token;
    } else if (this.relationalOperator.test(caractere)) {
      const { _token, _error } = this.treatRelationalOperator();
      error = _error;
      token = _token;
    } else if (this.punctuations.test(caractere)) {
      token = this.treatPunctuation();
    } else if (caractere.charCodeAt(0) === 13) {
      this.line += 1;
      this.index += 2;
    } else {
      error = {
        caractere: caractere.charCodeAt(0),
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
    console.log('Tokens', this.tokens);
    console.log('Error', this.error);
    console.groupEnd();
  }
}

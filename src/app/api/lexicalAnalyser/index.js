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
    this.arithmeticOperator = /[+-/*]/;
    this.relationalOperator = /[<>=]/;
    this.punctuations = /[;,().]/;
  }

  removeUselessData() {
    return this.error;
  }

  treatDigit() {
    return this.error;
  }

  treatLetter() {
    return this.error;
  }

  treatAssignment() {
    return this.error;
  }

  treatRelationalOperator() {
    return this.error;
  }

  treatPunctuation() {
    return this.error;
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
      const { _token, _error } = this.treatPunctuation();
      error = _error;
      token = _token;
    } else if (this.eol.test(caractere)) {
      this.line += 1;
    } else {
      error = {
        caractere,
        index,
        line: this.line,
      };
    }

    this.index = this.eof;

    return {
      token,
      error,
    };
  }

  init() {
    while (this.index < this.eof) {
      this.removeUselessData();
      if (this.index < this.eof) {
        const { token, error } = this.getToken();

        if (error) {
          this.error = error;
          break;
        }

        this.tokens.push(token);
      }
    }

    console.group('Resultado');
    console.group('File');
    console.log(this.file);
    console.groupEnd();
    console.log('Tokens', this.tokens);
    console.log('Error', this.error);
    console.groupEnd();
  }
}

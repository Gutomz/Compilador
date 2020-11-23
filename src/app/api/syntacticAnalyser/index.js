import LexicalAnalyser from '../lexicalAnalyser';
import SemanticAnalyser from '../semanticAnalyser';
import { ErrorType, SymbolsType, SymbolTableType } from '../../enum/token';

export default class SyntacticAnalyser {
  constructor(file) {
    this.lexicalAnalyser = new LexicalAnalyser(file);
    this.semanticAnalyser = new SemanticAnalyser();

    this.line = 1;
    this.token = null;
    this.lastToken = null;
    this.eof = false;
    this.tokens = [];
  }

  readToken() {
    try {
      const response = this.lexicalAnalyser.readToken();
      console.log('Leu token', response);
      if (typeof response === 'object') {
        this.line = response.line;
        this.lastToken = this.token;
        this.token = response;
        this.tokens.push(response);
        return;
      }

      this.eof = true;
    } catch (err) {
      const error = new Error(err.reason);
      error.type = 'lexico';
      Object.assign(error, err);
      throw error;
    }
  }

  compareToken(symbolsType) {
    if (typeof symbolsType === 'string') {
      if (this.token && this.token.simbolo === symbolsType) {
        return true;
      }

      return false;
    }

    if (typeof symbolsType === 'object') {
      for (let i = 0; i < symbolsType.length; i += 1) {
        if (this.token && this.token.simbolo === symbolsType[i]) {
          return true;
        }
      }

      return false;
    }

    return false;
  }

  Error(reason) {
    const error = new Error(reason);
    error.line = this.line;
    error.reason = reason;
    error.token = this.token;
    error.lastToken = this.lastToken;
    error.type = 'sintatico';

    throw error;
  }

  getSymbolTableFunctionType = (type) => {
    if (type === SymbolsType.INTEIRO) return SymbolTableType.FUNCTION_INTEGER;
    if (type === SymbolsType.BOOLEANO) return SymbolTableType.FUNCTION_BOOLEAN;

    return null;
  };

  init() {
    this.readToken();
    if (this.compareToken(SymbolsType.PROGRAMA)) {
      this.readToken();
      if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
        this.semanticAnalyser.insertTable(this.token, SymbolTableType.PROGRAM);
        this.readToken();
        if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
          this.blockAnalyserAlgorith();
          if (this.compareToken(SymbolsType.PONTO)) {
            this.readToken();
            if (!this.eof)
              this.Error(ErrorType.MISSING_FINAL_ERROR_COMMENT_EOF);
          } else this.Error(ErrorType.MISSING_PONT);
        } else this.Error(ErrorType.MISSING_POINT_COMMA);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } else this.Error(ErrorType.MISSING_PROGRAM);
  }

  blockAnalyserAlgorith() {
    console.group('Entrou blockAnalyserAlgorith');
    console.log(this.token);
    this.readToken();
    this.variableAnalyserAlgorithET();
    this.subroutinesAnalyserAlgorith();
    this.commandAnalyserAlgorith();
    console.log('Saiu blockAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  variableAnalyserAlgorithET() {
    console.group('Entrou variableAnalyserAlgorithET');
    console.log(this.token);

    if (this.compareToken(SymbolsType.VAR)) {
      this.readToken();
      if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
        while (this.compareToken(SymbolsType.IDENTIFICADOR)) {
          this.variableAnalyserAlgorith();
          if (this.compareToken(SymbolsType.PONTOVIRGULA)) this.readToken();
          else this.Error(ErrorType.MISSING_POINT_COMMA);
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    }
    console.log('Saiu variableAnalyserAlgorithET', this.token);
    console.groupEnd();
  }

  variableAnalyserAlgorith() {
    console.group('Entrou variableAnalyserAlgorith');
    console.log(this.token);

    const variableDeclarationTable = [];

    do {
      if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
        variableDeclarationTable.push(
          this.semanticAnalyser.insertTable(
            this.token,
            SymbolTableType.VARIABLE
          )
        );
        this.readToken();
        if (this.compareToken([SymbolsType.VIRGULA, SymbolsType.DOISPONTOS])) {
          if (this.compareToken(SymbolsType.VIRGULA)) {
            this.readToken();
            if (this.compareToken(SymbolsType.DOISPONTOS))
              this.Error(ErrorType.INVALID_COMMA);
          }
        } else this.Error(ErrorType.MISSING_DOUBLE_POINT);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } while (!this.compareToken(SymbolsType.DOISPONTOS));

    this.readToken();
    const type = this.typeAnalyserAlgorith();
    variableDeclarationTable.forEach((index) => {
      this.semanticAnalyser.updateSymbolTableVariableType(index, type);
    });
    console.log('Saiu variableAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  typeAnalyserAlgorith() {
    console.group('Entrou typeAnalyserAlgorith');
    console.log(this.token);
    const output = this.token.simbolo;

    if (!this.compareToken([SymbolsType.INTEIRO, SymbolsType.BOOLEANO])) {
      this.Error(ErrorType.INVALID_TYPE);
    }

    this.readToken();
    console.log('Saiu typeAnalyserAlgorith', this.token);
    console.groupEnd();
    return output;
  }

  commandAnalyserAlgorith() {
    console.group('Entrou commandAnalyserAlgorith');
    console.log(this.token);

    if (this.compareToken(SymbolsType.INICIO)) {
      this.readToken();

      if (!this.compareToken(SymbolsType.FIM)) {
        this.simpleCommandAnalyser();
        while (!this.compareToken(SymbolsType.FIM)) {
          if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
            this.readToken();
            if (!this.compareToken(SymbolsType.FIM)) {
              this.simpleCommandAnalyser();
            }
          } else this.Error(ErrorType.MISSING_POINT_COMMA);
        }
      }

      this.readToken();
    } else this.Error(ErrorType.MISSING_INIT);
    console.log('Saiu commandAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  simpleCommandAnalyser() {
    console.group('Entrou simpleCommandAnalyser');
    console.log(this.token);

    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.semanticAnalyser.searchTable(this.token, [
        SymbolTableType.VARIABLE,
        SymbolTableType.PROCEDURE,
      ]);
      this.procedureAssignmentCallAnalyser();
    } else if (this.compareToken(SymbolsType.SE)) {
      this.ifAnalyseAlgorith();
    } else if (this.compareToken(SymbolsType.ENQUANTO)) {
      this.whileAnalyserAlgorith();
    } else if (this.compareToken(SymbolsType.LEIA)) {
      this.readAnalyserAlgorith();
    } else if (this.compareToken(SymbolsType.ESCREVA)) {
      this.writeAnalyseAlgorith();
    } else {
      this.commandAnalyserAlgorith();
    }
    console.log('Saiu simpleCommandAnalyser', this.token);
    console.groupEnd();
  }

  procedureAssignmentCallAnalyser() {
    console.group('Entrou procedureAssignmentCallAnalyser');
    console.log(this.token);

    this.readToken();
    if (this.compareToken(SymbolsType.ATRIBUICAO)) {
      this.readToken();
      this.expressionAnalyserAlgorith();
    } else if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
      // this.procedureCallAnalyser();
    } else this.Error(ErrorType.INVALID_OPERATION);
    console.log('Saiu procedureAssignmentCallAnalyser', this.token);
    console.groupEnd();
  }

  // procedureCallAnalyser() {
  //   /* Analisador semântico */
  // }

  functionCallAnalyser() {
    console.group('Entrou functionCallAnalyser');
    console.log(this.token);
    this.readToken();
    console.log('Saiu functionCallAnalyser', this.token);
    console.groupEnd();
  }

  readAnalyserAlgorith() {
    console.group('Entrou readAnalyserAlgorith');
    console.log(this.token);

    this.readToken();
    if (this.compareToken(SymbolsType.ABREPARENTESES)) {
      this.readToken();
      if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
        this.semanticAnalyser.searchTable(this.token, SymbolTableType.VARIABLE);
        this.readToken();
        if (this.compareToken(SymbolsType.FECHAPARENTESES)) {
          this.readToken();
        } else this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } else this.Error(ErrorType.MISSING_OPEN_PARENTHESES);
    console.log('Saiu readAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  writeAnalyseAlgorith() {
    console.group('Entrou writeAnalyseAlgorith');
    console.log(this.token);

    this.readToken();
    if (this.compareToken(SymbolsType.ABREPARENTESES)) {
      this.readToken();
      if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
        this.semanticAnalyser.searchTable(this.token, [
          SymbolTableType.VARIABLE,
          SymbolTableType.FUNCTION_BOOLEAN,
          SymbolTableType.FUNCTION_INTEGER,
        ]);
        this.readToken();
        if (this.compareToken(SymbolsType.FECHAPARENTESES)) {
          this.readToken();
        } else this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } else this.Error(ErrorType.MISSING_OPEN_PARENTHESES);
    console.log('Saiu writeAnalyseAlgorith', this.token);
    console.groupEnd();
  }

  whileAnalyserAlgorith() {
    console.group('Entrou whileAnalyserAlgorith');
    console.log(this.token);

    this.readToken();
    this.expressionAnalyserAlgorith();
    if (this.compareToken(SymbolsType.FACA)) {
      this.readToken();
      this.simpleCommandAnalyser();
    } else this.Error(ErrorType.MISSING_DO);
    console.log('Saiu whileAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  ifAnalyseAlgorith() {
    console.group('Entrou ifAnalyseAlgorith');
    console.log(this.token);

    this.readToken();
    this.expressionAnalyserAlgorith();
    if (this.compareToken(SymbolsType.ENTAO)) {
      this.readToken();
      this.simpleCommandAnalyser();
      if (this.compareToken(SymbolsType.SENAO)) {
        this.readToken();
        this.simpleCommandAnalyser();
      }
    } else this.Error(ErrorType.MISSING_THEN);
    console.log('Saiu ifAnalyseAlgorith', this.token);
    console.groupEnd();
  }

  subroutinesAnalyserAlgorith() {
    console.group('Entrou subroutinesAnalyserAlgorith');
    console.log(this.token);

    while (this.compareToken([SymbolsType.PROCEDIMENTO, SymbolsType.FUNCAO])) {
      if (this.compareToken(SymbolsType.PROCEDIMENTO)) {
        this.procedureDeclarationAnalyserAlgorith();
      } else {
        this.functionDeclarationAnalyserAlgorith();
      }

      if (this.compareToken(SymbolsType.PONTOVIRGULA)) this.readToken();
      else this.Error(ErrorType.MISSING_POINT_COMMA);
    }
    console.log('Saiu subroutinesAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  procedureDeclarationAnalyserAlgorith() {
    console.group('Entrou procedureDeclarationAnalyserAlgorith');
    console.log(this.token);

    this.readToken();
    this.semanticAnalyser.insertTable(this.token, SymbolTableType.PROCEDURE);
    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.readToken();
      if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
        this.blockAnalyserAlgorith();
      } else this.Error(ErrorType.MISSING_POINT_COMMA);
    } else this.Error(ErrorType.MISSING_IDENTIFIER);
    this.semanticAnalyser.popScope();
    console.log('Saiu procedureDeclarationAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  functionDeclarationAnalyserAlgorith() {
    console.group('Entrou functionDeclarationAnalyserAlgorith');
    console.log(this.token);

    this.readToken();
    const functionToken = this.token;
    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.readToken();
      if (this.compareToken(SymbolsType.DOISPONTOS)) {
        this.readToken();
        const type = this.typeAnalyserAlgorith();
        this.semanticAnalyser.insertTable(
          functionToken,
          this.getSymbolTableFunctionType(type),
          type
        );
        if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
          this.blockAnalyserAlgorith();
        } else this.Error(ErrorType.MISSING_POINT_COMMA);
      } else this.Error(ErrorType.MISSING_DOUBLE_POINT);
    } else this.Error(ErrorType.MISSING_IDENTIFIER);

    this.semanticAnalyser.popScope();
    console.log('Saiu functionDeclarationAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  expressionAnalyserAlgorith() {
    console.group('Entrou expressionAnalyserAlgorith');
    console.log(this.token);

    this.simpleExpressionAnalyserAlgorith();
    while (
      this.compareToken([
        SymbolsType.MAIOR,
        SymbolsType.MAIORIGUAL,
        SymbolsType.MENOR,
        SymbolsType.MENORIGUAL,
        SymbolsType.IGUAL,
        SymbolsType.DIFERENTE,
      ])
    ) {
      this.semanticAnalyser.insertExpression(
        this.token.lexema,
        this.token.simbolo
      );
      this.readToken();
      this.simpleExpressionAnalyserAlgorith();
    }

    this.semanticAnalyser.verifyExpressionEnd();

    console.log('Saiu expressionAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  simpleExpressionAnalyserAlgorith() {
    console.group('Entrou simpleExpressionAnalyserAlgorith');
    console.log(this.token);

    if (this.compareToken([SymbolsType.MAIS, SymbolsType.MENOS])) {
      this.semanticAnalyser.insertExpression(
        this.compareToken(SymbolsType.MAIS) ? '+u' : '-u',
        this.token.simbolo
      );
      this.readToken();
    }

    this.termAnalyserAlgorith();
    while (
      this.compareToken([SymbolsType.MAIS, SymbolsType.MENOS, SymbolsType.OU])
    ) {
      this.semanticAnalyser.insertExpression(
        this.token.lexema,
        this.token.simbolo
      );
      this.readToken();
      this.termAnalyserAlgorith();
    }
    console.log('Saiu simpleExpressionAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  termAnalyserAlgorith() {
    console.group('Entrou termAnalyserAlgorith');
    console.log(this.token);

    this.factorAnalyserAlgorith();
    while (
      this.compareToken([SymbolsType.MULTI, SymbolsType.DIV, SymbolsType.E])
    ) {
      this.semanticAnalyser.insertExpression(
        this.token.lexema,
        this.token.simbolo
      );
      this.readToken();
      this.factorAnalyserAlgorith();
    }
    console.log('Saiu termAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  factorAnalyserAlgorith() {
    console.group('Entrou factorAnalyserAlgorith');
    console.log(this.token);

    const insertExpression = () =>
      this.semanticAnalyser.insertExpression(
        this.token.lexema,
        this.token.simbolo
      );

    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.semanticAnalyser.searchTable(this.token, [
        SymbolTableType.VARIABLE,
        SymbolTableType.FUNCTION_INTEGER,
        SymbolTableType.FUNCTION_BOOLEAN,
      ]);
      insertExpression();
      this.functionCallAnalyser();
    } else if (this.compareToken(SymbolsType.DIGITO)) {
      insertExpression();
      this.readToken();
    } else if (this.compareToken(SymbolsType.NAO)) {
      insertExpression();
      this.readToken();
      this.factorAnalyserAlgorith();
    } else if (this.compareToken(SymbolsType.ABREPARENTESES)) {
      insertExpression();
      this.readToken();
      this.expressionAnalyserAlgorith();
      if (this.compareToken(SymbolsType.FECHAPARENTESES)) {
        insertExpression();
        this.readToken();
      } else this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
    } else if (this.compareToken([SymbolsType.VERDADEIRO, SymbolsType.FALSO])) {
      insertExpression();
      this.readToken();
    } else this.Error(ErrorType.INVALID_FACTOR);
    console.log('Saiu factorAnalyserAlgorith', this.token);
    console.groupEnd();
  }
}

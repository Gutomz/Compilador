import LexicalAnalyser from '../lexicalAnalyser';
import SemanticAnalyser from '../semanticAnalyser';
import CodeGeneration from '../codeGeneration';
import {
  ErrorType,
  PrecedenceTableType,
  SymbolsType,
  SymbolTableType,
} from '../../enum/token';

export default class SyntacticAnalyser {
  constructor(file) {
    this.lexicalAnalyser = new LexicalAnalyser(file);
    this.semanticAnalyser = new SemanticAnalyser();
    this.codeGeneration = new CodeGeneration();

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

  Error(reason, token) {
    const error = new Error(reason);
    error.line = token ? token.line : this.line;
    error.reason = reason;
    error.token = token || this.token;
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
          this.codeGeneration.insertCode('START');
          this.codeGeneration.insertCode('ALLOC', '0', '1');
          this.blockAnalyserAlgorith();
          if (this.semanticAnalyser.varStack.length > 0) {
            this.codeGeneration.insertCode(
              'DALLOC',
              '1',
              this.semanticAnalyser.varStack.length
            );
          }
          this.codeGeneration.insertCode('DALLOC', '0', '1');
          if (this.compareToken(SymbolsType.PONTO)) {
            this.readToken();
            if (!this.eof)
              this.Error(ErrorType.MISSING_FINAL_ERROR_COMMENT_EOF);
            this.codeGeneration.insertCode('HLT');
            console.log(this.codeGeneration.code);
          } else this.Error(ErrorType.MISSING_PONT);
        } else this.Error(ErrorType.MISSING_POINT_COMMA);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } else this.Error(ErrorType.MISSING_PROGRAM);
  }

  blockAnalyserAlgorith(scopeFunction) {
    console.group('Entrou blockAnalyserAlgorith');
    console.log(this.token);
    this.readToken();
    this.variableAnalyserAlgorithET();
    this.subroutinesAnalyserAlgorith();
    const hasReturn = this.commandAnalyserAlgorith(scopeFunction);
    console.log('Saiu blockAnalyserAlgorith', this.token);
    console.groupEnd();
    return hasReturn;
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

    const stackLength = this.semanticAnalyser.varStack.length + 1;
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

    this.codeGeneration.insertCode(
      'ALLOC',
      stackLength,
      variableDeclarationTable.length
    );

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

  commandAnalyserAlgorith(scopeFunction) {
    console.group('Entrou commandAnalyserAlgorith');
    console.log(this.token);

    let hasReturn = false;

    if (this.compareToken(SymbolsType.INICIO)) {
      this.readToken();

      if (!this.compareToken(SymbolsType.FIM)) {
        hasReturn = this.simpleCommandAnalyser(scopeFunction);
        while (!this.compareToken(SymbolsType.FIM)) {
          if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
            this.readToken();
            if (!this.compareToken(SymbolsType.FIM)) {
              if (!hasReturn)
                hasReturn = this.simpleCommandAnalyser(scopeFunction);
              else if (scopeFunction)
                this.Error(ErrorType.UNREACHED_CODE, this.token);
            }
          } else this.Error(ErrorType.MISSING_POINT_COMMA);
        }
      }

      this.readToken();
    } else this.Error(ErrorType.MISSING_INIT);
    console.log('Saiu commandAnalyserAlgorith', this.token);
    console.groupEnd();

    return hasReturn;
  }

  simpleCommandAnalyser(scopeFunction) {
    console.group('Entrou simpleCommandAnalyser');
    console.log(this.token);

    let hasReturn = false;

    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      hasReturn = this.procedureAssignmentCallAnalyser(scopeFunction);
    } else if (this.compareToken(SymbolsType.SE)) {
      hasReturn = this.ifAnalyseAlgorith(scopeFunction);
    } else if (this.compareToken(SymbolsType.ENQUANTO)) {
      hasReturn = this.whileAnalyserAlgorith(scopeFunction);
    } else if (this.compareToken(SymbolsType.LEIA)) {
      this.readAnalyserAlgorith();
    } else if (this.compareToken(SymbolsType.ESCREVA)) {
      this.writeAnalyseAlgorith();
    } else {
      hasReturn = this.commandAnalyserAlgorith(scopeFunction);
    }
    console.log('Saiu simpleCommandAnalyser', this.token);
    console.groupEnd();

    return hasReturn;
  }

  procedureAssignmentCallAnalyser(scopeFunction) {
    console.group('Entrou procedureAssignmentCallAnalyser');
    console.log(this.token);

    let hasReturn = false;
    const item = this.semanticAnalyser.searchTable(this.token, [
      SymbolTableType.VARIABLE,
      SymbolTableType.PROCEDURE,
      SymbolTableType.FUNCTION_BOOLEAN,
      SymbolTableType.FUNCTION_INTEGER,
    ]);
    const { token } = this;

    if (!item) this.Error(ErrorType.UNDECLARED);

    if (item.type === SymbolTableType.PROCEDURE) {
      this.codeGeneration.insertCode('CALL', `L${item.label}`);
    }

    this.readToken();
    if (
      this.semanticAnalyser.compareIdentifierType(item.type, [
        SymbolTableType.VARIABLE,
        SymbolTableType.FUNCTION_BOOLEAN,
        SymbolTableType.FUNCTION_INTEGER,
      ])
    ) {
      if (this.compareToken(SymbolsType.ATRIBUICAO)) {
        this.readToken();
        hasReturn = this.expressionAnalyserAlgorith(
          item.declarationType,
          token,
          scopeFunction
        );

        if (
          this.semanticAnalyser.compareIdentifierType(item.type, [
            SymbolTableType.FUNCTION_BOOLEAN,
            SymbolTableType.FUNCTION_INTEGER,
          ])
        ) {
          this.codeGeneration.insertCode('STR', '0');
          const removeScopeVarLength = this.semanticAnalyser.varStack.filter(
            (x) => x.scope === this.semanticAnalyser.actualScope
          ).length;
          const initialScopeVarLength =
            this.semanticAnalyser.varStack.length - removeScopeVarLength;
          if (removeScopeVarLength > 0)
            this.codeGeneration.insertCode(
              'DALLOC',
              initialScopeVarLength,
              removeScopeVarLength
            );
          this.codeGeneration.insertCode('RETURN');
        } else {
          this.codeGeneration.insertCode('STR', item.stackIndex);
        }
      } else this.Error(ErrorType.MISSING_ASSIGNMENT);
    }

    console.log('Saiu procedureAssignmentCallAnalyser', this.token);
    console.groupEnd();

    return hasReturn;
  }

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
        const item = this.semanticAnalyser.searchTable(
          this.token,
          SymbolTableType.VARIABLE
        );
        this.readToken();
        if (this.compareToken(SymbolsType.FECHAPARENTESES)) {
          this.codeGeneration.insertCode('RD');
          this.codeGeneration.insertCode('STR', item.stackIndex);
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
        const item = this.semanticAnalyser.searchTable(this.token, [
          SymbolTableType.VARIABLE,
          SymbolTableType.FUNCTION_BOOLEAN,
          SymbolTableType.FUNCTION_INTEGER,
        ]);
        if (
          this.compareToken(this.token, [
            SymbolTableType.FUNCTION_BOOLEAN,
            SymbolTableType.FUNCTION_INTEGER,
          ])
        ) {
          this.codeGeneration.insertCode('CALL', `L${item.label}`);
          this.codeGeneration.insertCode('LDV', '0');
        } else {
          this.codeGeneration.insertCode('LDV', item.stackIndex);
        }
        this.readToken();
        if (this.compareToken(SymbolsType.FECHAPARENTESES)) {
          this.codeGeneration.insertCode('PRN');
          this.readToken();
        } else this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
      } else this.Error(ErrorType.MISSING_IDENTIFIER);
    } else this.Error(ErrorType.MISSING_OPEN_PARENTHESES);
    console.log('Saiu writeAnalyseAlgorith', this.token);
    console.groupEnd();
  }

  whileAnalyserAlgorith(scopeFunction) {
    console.group('Entrou whileAnalyserAlgorith');
    console.log(this.token);

    let hasReturn = false;
    const rotulo1 = this.codeGeneration.rotulo;
    let rotulo2 = null;
    this.codeGeneration.incrementRotulo();

    this.codeGeneration.insertCode('NULL', '', '', rotulo1);

    this.readToken();
    this.expressionAnalyserAlgorith(PrecedenceTableType.BOOLEAN, {
      line: this.line,
    });
    if (this.compareToken(SymbolsType.FACA)) {
      rotulo2 = this.codeGeneration.rotulo;
      this.codeGeneration.insertCode('JMPF', `L${this.codeGeneration.rotulo}`);
      this.codeGeneration.incrementRotulo();

      this.readToken();
      hasReturn = this.simpleCommandAnalyser(scopeFunction);

      this.codeGeneration.insertCode('JMP', `L${rotulo1}`);
      this.codeGeneration.insertCode('NULL', '', '', rotulo2);
    } else this.Error(ErrorType.MISSING_DO);
    console.log('Saiu whileAnalyserAlgorith', this.token);
    console.groupEnd();

    return hasReturn;
  }

  ifAnalyseAlgorith(scopeFunction) {
    console.group('Entrou ifAnalyseAlgorith');
    console.log(this.token);

    let hasThenReturn = false;
    let hasElseReturn = false;
    let hasElse = false;

    const rotulo1 = this.codeGeneration.rotulo;
    this.codeGeneration.incrementRotulo();
    const rotulo2 = this.codeGeneration.rotulo;
    this.codeGeneration.incrementRotulo();

    this.readToken();
    this.expressionAnalyserAlgorith(PrecedenceTableType.BOOLEAN, {
      line: this.line,
    });
    if (this.compareToken(SymbolsType.ENTAO)) {
      this.codeGeneration.insertCode('JMPF', `L${rotulo1}`);
      this.readToken();
      hasThenReturn = this.simpleCommandAnalyser(scopeFunction);
      if (this.compareToken(SymbolsType.SENAO)) {
        this.codeGeneration.insertCode('JMP', `L${rotulo2}`);
        this.codeGeneration.insertCode('NULL', '', '', rotulo1);
        this.readToken();
        hasElse = true;
        hasElseReturn = this.simpleCommandAnalyser(scopeFunction);
        this.codeGeneration.insertCode('NULL', '', '', rotulo2);
      } else {
        this.codeGeneration.insertCode('NULL', '', '', rotulo1);
      }
    } else this.Error(ErrorType.MISSING_THEN);

    console.log('hasThenReturn', hasThenReturn);
    console.log('hasElseReturn', hasElseReturn);
    console.log(
      'Return IF',
      scopeFunction &&
        hasElse &&
        !(
          (!hasThenReturn && !hasElseReturn) ||
          (hasThenReturn && hasElseReturn)
        )
    );

    console.log('Saiu ifAnalyseAlgorith', this.token);
    console.groupEnd();

    if (scopeFunction && hasElse && hasThenReturn && !hasElseReturn)
      this.functionScopeError = () =>
        this.Error(ErrorType.MISSING_WAY_RETURN, scopeFunction.token);

    return hasThenReturn && hasElseReturn;
  }

  subroutinesAnalyserAlgorith() {
    console.group('Entrou subroutinesAnalyserAlgorith');
    console.log(this.token);

    let auxRot;
    let flag = false;

    if (this.compareToken([SymbolsType.PROCEDIMENTO, SymbolsType.FUNCAO])) {
      auxRot = this.codeGeneration.rotulo;
      this.codeGeneration.insertCode('JMP', `L${auxRot}`);
      this.codeGeneration.incrementRotulo();
      flag = true;
    }

    while (this.compareToken([SymbolsType.PROCEDIMENTO, SymbolsType.FUNCAO])) {
      if (this.compareToken(SymbolsType.PROCEDIMENTO)) {
        this.procedureDeclarationAnalyserAlgorith();
      } else {
        this.functionDeclarationAnalyserAlgorith();
      }

      if (this.compareToken(SymbolsType.PONTOVIRGULA)) this.readToken();
      else this.Error(ErrorType.MISSING_POINT_COMMA);
    }

    if (flag) {
      this.codeGeneration.insertCode('NULL', '', '', auxRot);
    }
    console.log('Saiu subroutinesAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  procedureDeclarationAnalyserAlgorith() {
    console.group('Entrou procedureDeclarationAnalyserAlgorith');
    console.log(this.token);
    const initialScopeVarLength = this.semanticAnalyser.varStack.length + 1;

    this.readToken();
    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.semanticAnalyser.insertTable(
        this.token,
        SymbolTableType.PROCEDURE,
        null,
        this.codeGeneration.rotulo
      );
      this.codeGeneration.insertCode(
        'NULL',
        '',
        '',
        this.codeGeneration.rotulo
      );
      this.codeGeneration.incrementRotulo();
      this.readToken();
      if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
        this.blockAnalyserAlgorith();
      } else this.Error(ErrorType.MISSING_POINT_COMMA);
    } else this.Error(ErrorType.MISSING_IDENTIFIER);

    const removeScopeVarLength = this.semanticAnalyser.popScope();
    this.codeGeneration.insertCode(
      'DALLOC',
      initialScopeVarLength,
      removeScopeVarLength
    );
    this.codeGeneration.insertCode('RETURN');

    console.log('Saiu procedureDeclarationAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  functionDeclarationAnalyserAlgorith() {
    console.group('Entrou functionDeclarationAnalyserAlgorith');
    console.log(this.token);

    this.readToken();
    const functionToken = this.token;

    const initialScopeVarLength = this.semanticAnalyser.varStack.length + 1;
    console.log('initialScopeVarLength', initialScopeVarLength);

    let hasReturn = false;

    if (this.compareToken(SymbolsType.IDENTIFICADOR)) {
      this.readToken();
      if (this.compareToken(SymbolsType.DOISPONTOS)) {
        this.readToken();
        const type = this.typeAnalyserAlgorith();
        const scopeFunction = this.semanticAnalyser.symbolTable[
          this.semanticAnalyser.insertTable(
            functionToken,
            this.getSymbolTableFunctionType(type),
            type,
            this.codeGeneration.rotulo
          )
        ];
        this.codeGeneration.insertCode(
          'NULL',
          '',
          '',
          this.codeGeneration.rotulo
        );
        this.codeGeneration.incrementRotulo();
        if (this.compareToken(SymbolsType.PONTOVIRGULA)) {
          this.functionScopeError = null;
          hasReturn = this.blockAnalyserAlgorith(scopeFunction);
        } else this.Error(ErrorType.MISSING_POINT_COMMA);
      } else this.Error(ErrorType.MISSING_DOUBLE_POINT);
    } else this.Error(ErrorType.MISSING_IDENTIFIER);

    if (!hasReturn) {
      if (this.functionScopeError) this.functionScopeError();

      this.Error(ErrorType.MISSING_RETURN, functionToken);
    }

    this.semanticAnalyser.popScope();

    console.log('Saiu functionDeclarationAnalyserAlgorith', this.token);
    console.groupEnd();
  }

  expressionAnalyserAlgorith(returnType, token, scopeFunction) {
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

    const response = this.semanticAnalyser.verifyExpressionEnd(
      returnType,
      token
    );

    if (response && response.expression) {
      response.expression.forEach((operator) => {
        if (
          this.semanticAnalyser.compareIdentifierType(
            operator.type,
            SymbolsType.IDENTIFICADOR
          )
        ) {
          console.log('Check Function', operator);
          if (
            this.semanticAnalyser.compareIdentifierType(operator.symbol.type, [
              SymbolTableType.FUNCTION_BOOLEAN,
              SymbolTableType.FUNCTION_INTEGER,
            ])
          ) {
            this.codeGeneration.insertCode('CALL', `L${operator.symbol.label}`);
            this.codeGeneration.insertCode('LDV', '0');
          } else this.codeGeneration.insertCode('LDV', operator.stackIndex);
        } else if (
          this.semanticAnalyser.compareIdentifierType(
            operator.type,
            SymbolsType.DIGITO
          )
        ) {
          this.codeGeneration.insertCode('LDC', operator.lexema);
        } else if (
          this.semanticAnalyser.compareIdentifierType(
            operator.type,
            SymbolsType.FALSO
          )
        ) {
          this.codeGeneration.insertCode('LDC', 0);
        } else if (
          this.semanticAnalyser.compareIdentifierType(
            operator.type,
            SymbolsType.VERDADEIRO
          )
        ) {
          this.codeGeneration.insertCode('LDC', 1);
        } else {
          this.codeGeneration.insertCode(operator.code);
        }
      });
    }

    console.log('response', response);
    console.log('expression', response && response.expression);
    console.log('scopeFunction', scopeFunction);
    console.log('token.lexema', token && token.lexema);
    console.log(
      'scopeFunction.token.lexema',
      scopeFunction && scopeFunction.token.lexema
    );
    console.log('response.token.lexema', response && response.token.lexema);
    console.log(
      'scopeFunction.token.lexema === response.token.lexema',
      response &&
        scopeFunction &&
        token &&
        token.lexema &&
        scopeFunction.token.lexema === response.token.lexema
    );

    console.log('Saiu expressionAnalyserAlgorith', this.token);
    console.groupEnd();

    if (
      response &&
      scopeFunction &&
      token &&
      token.lexema &&
      scopeFunction.token.lexema === response.token.lexema
    ) {
      return true;
    }
    return false;
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
      this.semanticAnalyser.insertExpression('-unao', this.token.simbolo);
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

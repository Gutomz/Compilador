import {
  ErrorType,
  PrecedenceTableType,
  SymbolsType,
  SymbolTableType,
} from '../../enum/token';

export default class SemanticAnalyser {
  constructor() {
    this.symbolTable = [];
    this.scopeTable = [];

    this.expression = [];
    this.expressionStack = [];
    this.expressionLevel = 0;

    this.digits = /^\d+$/;
  }

  precedenceTable = [
    { lexema: ')', level: 8 },
    {
      lexema: '-u',
      level: 7,
      operators: 1,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: '+u',
      level: 7,
      operators: 1,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: 'nao',
      level: 7,
      operators: 1,
      type: PrecedenceTableType.BOOLEAN,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '*',
      level: 6,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: 'div',
      level: 6,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: '-',
      level: 5,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: '+',
      level: 5,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.INTEGER,
    },
    {
      lexema: '>',
      level: 4,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '>=',
      level: 4,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '<',
      level: 4,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '<=',
      level: 4,
      operators: 2,
      type: PrecedenceTableType.INTEGER,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '=',
      level: 3,
      operators: 2,
      type: PrecedenceTableType.BOTH,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: '!=',
      level: 3,
      operators: 2,
      type: PrecedenceTableType.BOTH,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: 'e',
      level: 2,
      operators: 2,
      type: PrecedenceTableType.BOOLEAN,
      return: PrecedenceTableType.BOOLEAN,
    },
    {
      lexema: 'ou',
      level: 1,
      operators: 2,
      type: PrecedenceTableType.BOOLEAN,
      return: PrecedenceTableType.BOOLEAN,
    },
    { lexema: '(', level: 0 },
  ];

  Error = (reason, token) => {
    const error = new Error(reason);
    error.line = token.line;
    error.token = token;
    error.reason = reason;
    error.type = 'semantico';

    throw error;
  };

  /*
    {
      token: {
        lexema: 'alguma',
        simbolo: 's',
        linha: 0,
      },
      type: "variavel",
      declarationType: "",
      scope: ['a', 'b'],
      label: "",
    }
  */

  compareIdentifierType = (compareType, symbolsType) => {
    if (typeof symbolsType === 'string') {
      if (compareType === symbolsType) {
        return true;
      }

      return false;
    }

    if (typeof symbolsType === 'object') {
      for (let i = 0; i < symbolsType.length; i += 1) {
        if (compareType === symbolsType[i]) {
          return true;
        }
      }

      return false;
    }

    return false;
  };

  checkScope = (actualScope, objectScope) => {
    if (actualScope.length >= objectScope.length) {
      for (let i = 0; i < objectScope.length; i += 1) {
        if (actualScope[i] !== objectScope[i]) return true;
      }

      return false;
    }

    return true;
  };

  checkDuplicate(token) {
    const findItem = this.symbolTable.find(
      (item) => item.token.lexema === token.lexema
    );

    if (!findItem) return true;

    if (!this.checkScope(this.scopeTable, findItem.scope))
      return this.Error(ErrorType.DUPLICATED, token);

    return true;
  }

  updateSymbolTableVariableType(index, type) {
    if (this.symbolTable[index]) this.symbolTable[index].declarationType = type;
  }

  insertTable(token, type, declarationType, label) {
    console.group('Insert Table');
    console.log(token, type, declarationType);
    console.log('Symbol Table', this.symbolTable);
    console.log('Scope Table', this.scopeTable);
    this.checkDuplicate(token);

    this.symbolTable.push({
      token,
      type,
      declarationType,
      scope: [...this.scopeTable],
      label,
    });

    if (
      this.compareIdentifierType(type, [
        SymbolTableType.FUNCTION_BOOLEAN,
        SymbolTableType.FUNCTION_INTEGER,
        SymbolTableType.PROCEDURE,
      ])
    ) {
      this.scopeTable.push(token.lexema);
    }

    console.groupEnd();

    return this.symbolTable.length === 0 ? 0 : this.symbolTable.length - 1;
  }

  searchTable(token, type) {
    console.log('Search Table', token, type);
    const findItem = this.symbolTable.find(
      (item) => item.token.lexema === token.lexema
    );

    const throwError = () => {
      if (typeof type === 'object') {
        this.Error(ErrorType.UNDECLARED, token);
      } else if (
        this.compareIdentifierType(type, [
          SymbolTableType.FUNCTION_BOOLEAN,
          SymbolTableType.FUNCTION_INTEGER,
        ])
      ) {
        this.Error(ErrorType.UNDECLARED_FUNC);
      } else if (this.compareIdentifierType(type, SymbolTableType.PROCEDURE)) {
        this.Error(ErrorType.UNDECLARED_PROC);
      } else if (this.compareIdentifierType(type, SymbolTableType.VARIABLE)) {
        this.Error(ErrorType.UNDECLARED_VAR);
      }
    };

    if (!findItem) throwError();

    if (!this.compareIdentifierType(findItem.type, type)) throwError();

    if (this.checkScope(this.scopeTable, findItem.scope)) throwError();

    return findItem;
  }

  popScope() {
    return this.scopeTable.pop();
  }

  insertExpression(lexema, type) {
    if (
      this.compareIdentifierType(type, [
        SymbolsType.IDENTIFICADOR,
        SymbolsType.DIGITO,
        SymbolsType.VERDADEIRO,
        SymbolsType.FALSO,
      ])
    ) {
      this.expression.push(lexema);
    } else if (this.compareIdentifierType(type, SymbolsType.ABREPARENTESES)) {
      this.expressionLevel += 1;
      this.expressionStack.push(lexema);
    } else if (this.compareIdentifierType(type, SymbolsType.FECHAPARENTESES)) {
      let stackItem = null;
      do {
        stackItem = this.expressionStack.pop();
        if (stackItem !== '(') this.expression.push(stackItem);
      } while (stackItem !== '(');
      this.expressionLevel -= 1;
    } else {
      const operatorItem = this.precedenceTable.find(
        (item) => item.lexema === lexema
      );
      const stackOperatorItem =
        this.expressionStack.length > 0
          ? this.precedenceTable.find(
              (item) =>
                item.lexema ===
                this.expressionStack[this.expressionStack.length - 1]
            )
          : null;

      if (!operatorItem) return;

      if (
        !stackOperatorItem ||
        (stackOperatorItem && stackOperatorItem.lexema === '(')
      ) {
        this.expressionStack.push(lexema);
      } else if (operatorItem.level <= stackOperatorItem.level) {
        this.expression.push(this.expressionStack.pop());
        this.expressionStack.push(lexema);
      } else {
        this.expressionStack.push(lexema);
      }
    }
    console.group('insertExpression');
    console.log('this.expression', this.expression);
    console.log('this.expressionStack', this.expressionStack);
    console.log('this.expressionLevel', this.expressionLevel);
    console.groupEnd();
  }

  verifyExpressionEnd() {
    if (this.expressionLevel !== 0) return;

    if (this.expressionStack.length > 0) {
      for (let i = 0; i < this.expressionStack.length; i += 1) {
        this.expression.push(this.expressionStack.pop());
      }
    }

    console.group('Expression End');
    console.log('this.expression', this.expression);
    console.log('this.expressionStack', this.expressionStack);
    console.log('this.expressionLevel', this.expressionLevel);
    console.groupEnd();

    this.expression = [];
    this.expressionStack = [];
    this.expressionLevel = 0;
  }
}

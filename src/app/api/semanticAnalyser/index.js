import { ErrorType, SymbolTableType } from '../../enum/token';

export default class SemanticAnalyser {
  constructor() {
    this.symbolTable = [];
    this.scopeTable = [];
  }

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
}

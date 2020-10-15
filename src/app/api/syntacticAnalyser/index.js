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
        token = this.readToken();
        if (token.simbolo === SymbolsType.PONTOVIRGULA) {
          this.blockAnalyserAlgorith();
          if (token.simbolo === SymbolsType.PONTO) {
            // if (!eof || comentario) {
            //     //sucesso
            // } else {
            //   this.Error(ErrorType.MISSING_FINAL_ERROR_COMMENT_EOF);
            // }
          } else {
            this.Error(ErrorType.MISSING_PONT);
          }
        } else {
          this.Error(ErrorType.MISSING_POINT_COMMA);
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    } else {
      this.Error(ErrorType.MISSING_PROGRAM);
    }
  }

  blockAnalyserAlgorith() {
    const token = this.readToken();
    this.variableAnalyserAlgorithET();
    // AnalisaSubrotinas
    // AnalisaComandos
  }

  variableAnalyserAlgorithET() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.VAR) {
      token = this.readToken();
      if (token.simbolo === SymbolsType.IDENTIFICADOR) {
        // abalisaVariáveis
        if (token.simbolo === SymbolsType.PONTOVIRGULA) {
          // return sucesso Léxico
        } else {
          this.Error(ErrorType.MISSING_POINT_COMMA);
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    } else {
      this.Error(ErrorType.MISSING_VAR);
    }
  }

  variableAnalyserAlgorith() {
    let token = this.readToken();
    while (token.simbolo === SymbolsType.DOISPONTOS) {
      if (token.simbolo === SymbolsType.IDENTIFICADOR) {
        token = this.readToken();
        if (
          token.simbolo === SymbolsType.VIRGULA ||
          token.simbolo === SymbolsType.DOISPONTOS
        ) {
          if (token.simbolo === SymbolsType.VIRGULA) {
            token = this.readToken();
            if (token.simbolo === SymbolsType.DOISPONTOS) {
              // error
            } else {
              // fim
            }
          } else {
            // fim;
          }
        } else {
          // Erro por falta do virugla/dois pontos. Usar flag?
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    }

    token = this.readToken();
    // AnalisaTipo
  }

  typeAnalyserAlgorith() {
    let token = this.readToken();
    if (
      token.simbolo !== SymbolsType.INTEIRO &&
      token.simbolo !== SymbolsType.BOOLEANO
    ) {
      // Falta de uma das condições da parte de cima. Colocar flag pra identificar?
    } else {
      token = this.readToken();
    }
  }

  commandAnalyserAlgorith() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.INICIO) {
      token = this.readToken();
      // AnáliseComandoSimples
      while (token.simbolo !== SymbolsType.FIM) {
        if (token.simbolo === SymbolsType.PONTOVIRGULA) {
          token = this.readToken();
          if (token.simbolo !== SymbolsType.FIM) {
            // AnáliseComandoSimples
            // Fim
          }
        } else {
          this.Error(ErrorType.PONTOVIRGULA);
        }
      }
    } else {
      this.Error(ErrorType.MISSING_IDENTIFIER);
    }
  }

  simpleCommandAnalyser() {
    const token = this.readToken();
    if (token.simbolo === SymbolsType.IDENTIFICADOR) {
      // AnalisaAtributoChProcedimento
    } else if (token.simbolo === SymbolsType.SE) {
      // AnalisaSe
    } else if (token.simbolo === SymbolsType.ENQUANTO) {
      // AnalisaEnquanto
    } else if (token.simbolo === SymbolsType.LEIA) {
      // AnalisaLeia
    } else if (token.simbolo === SymbolsType.ESCREVA) {
      // AnalisaEscreva
    } else {
      // AnalisaComando
    }
  }

  procAtribAnalyser() {
    const token = this.readToken();
    if (token.simbolo === SymbolsType.ATRIBUICAO) {
      // AnalisaAtribuicao
    } else {
      // ChamadaProcedimento
    }
  }

  readAnalyserAlgorith() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.ABREPARENTESES) {
      token = this.readToken();
      if (token.simbolo === SymbolsType.IDENTIFICADOR) {
        token = this.readToken();
        if (token.simbolo === SymbolsType.FECHAPARENTESES) {
          token = this.readToken();
        } else {
          this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    } else {
      this.Error(ErrorType.MISSING_OPEN_PARENTHESES);
    }
  }

  writeAnalyseAlgorith() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.ABREPARENTESES) {
      token = this.readToken();
      if (token.simbolo === SymbolsType.IDENTIFICADOR) {
        token = this.readToken();
        if (token.simbolo === SymbolsType.FECHAPARENTESES) {
          token = this.readToken();
        } else {
          this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
        }
      } else {
        this.Error(ErrorType.MISSING_IDENTIFIER);
      }
    } else {
      this.Error(ErrorType.MISSING_OPEN_PARENTHESES);
    }
  }

  whileAnalyserAlgorith() {
    let token = this.readToken();
    // AnalisaExpressão
    if (token.simbolo === SymbolsType.FACA) {
      token = this.readToken();
      // AnalisaComandoSimples simpleCommandAnalyser
    } else {
      this.Error(ErrorType.MISSING_IDENTIFIER); // tá certo?
    }
  }

  ifAnalyseAlgorith() {
    // DÚVIDA!
    let token = this.readToken();
    if (token.simbolo === SymbolsType.ENTAO) {
      token = this.readToken();
      // AnalisaComandoSimples simpleCommandAnalyser
      if (token.simbolo === SymbolsType.SENAO) {
        token = this.readToken();
        // AnalisaComandoSimples simpleCommandAnalyser
      } else {
        // fim
      }
    } else {
      this.Error(ErrorType.MISSING_IDENTIFIER);
    }
  }

  // subroutinesAnalyserAlgorith() {
  //   let token = this.readToken();
  //   if (token.simbolo === SymbolsType.PROCEDIMENTO || token.simbolo === SymbolsType.FUNCAO) {
  //       while (token.simbolo === SymbolsType.PROCEDIMENTO || token.simbolo === SymbolsType.FUNCAO) {
  //         if (token.simbolo === SymbolsType.PROCEDIMENTO) {
  //           //AnalisaDeclaracaoProcedimento
  //         } else {
  //           //AnalisaDeclaracaoFuncao
  //         }
  //       }
  //   }
  // }

  functionDeclarationAnalyserAlgorith() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.IDENTIFICADOR) {
      token = this.readToken();
      if (token.simbolo === SymbolsType.DOISPONTOS) {
        token = this.readToken();
        if (
          token.simbolo === SymbolsType.INTEIRO ||
          token.simbolo === SymbolsType.BOOLEANO
        ) {
          token = this.readToken();
          if (token.simbolo === SymbolsType.PONTOVIRGULA) {
            // AnalisaBloco
          }
        } else {
          // Falta de inteiro ou booleano. Usar flag?
        }
      } else {
        this.Error(ErrorType.MISSING_DOUBLE_POINT);
      }
    } else {
      this.Error(ErrorType.MISSING_IDENTIFIER);
    }
  }

  expressionAnalyserAlgorith() {
    let token = this.readToken();
    // AnalisaExpressaoSimples
    if (
      token.simbolo === SymbolsType.MAIOR ||
      token.simbolo === SymbolsType.MAIORIGUAL ||
      token.simbolo === SymbolsType.MENOR ||
      token.simbolo === SymbolsType.MENORIGUAL ||
      token.simbolo === SymbolsType.IGUAL ||
      token.simbolo === SymbolsType.DIFERENTE
    ) {
      token = this.readToken();
      // AnalisaExpressaoSimples
    }
  }

  simpleExpressionAnalyserAlgorith() {
    let token = this.readToken();
    if (
      token.simbolo === SymbolsType.MAIS ||
      token.simbolo === SymbolsType.MENOS
    ) {
      token = this.readToken();
      // AnalisaTermo
      while (
        token.simbolo === SymbolsType.MAIS ||
        token.simbolo === SymbolsType.MENOS ||
        token.simbolo === SymbolsType.OU
      ) {
        token = this.readToken();
        // AnalisaTermo
      }
    }
  }

  termAnalyserAlgorith() {
    let token = this.readToken();
    while (
      token.simbolo === SymbolsType.MULTI ||
      token.simbolo === SymbolsType.DIV ||
      token.simbolo === SymbolsType.SE
    ) {
      token = this.readToken();
      // AnalisaFator
    }
  }

  factorAnalyserAlgorith() {
    let token = this.readToken();
    if (token.simbolo === SymbolsType.IDENTIFICADOR) {
      // AnalisaChamadaFuncao
      // Fim
    } else if (token.simbolo === SymbolsType.DIGITO) {
      token = this.readToken();
    } else if (token.simbolo === SymbolsType.NAO) {
      token = this.readToken();
      // AnalisaFator
    } else if (token.simbolo === SymbolsType.ABREPARENTESES) {
      token = this.readToken();
      // AnalisaExpressão(Token)
      if (token.simbolo === SymbolsType.FECHAPARENTESES) {
        token = this.readToken();
      } else {
        this.Error(ErrorType.MISSING_CLOSE_PARENTHESES);
      }
    } else if (
      token.simbolo === SymbolsType.VERDADEIRO ||
      token.simbolo === SymbolsType.FALSO
    ) {
      token = this.readToken();
    }
  }
}

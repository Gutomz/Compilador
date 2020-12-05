export default class CodeGeneration {
  constructor() {
    this.code = '';
    this.rotulo = 1;
  }

  incrementRotulo() {
    this.rotulo += 1;
  }

  insertCode(comando, var1, var2, rotulo, comentario) {
    if (rotulo) this.code += `L${rotulo} `;
    this.code += `${comando}`;
    if (var1) this.code += ` ${var1}`;
    if (var2) this.code += `,${var2}`;
    if (comentario) this.code += ` //${comentario}`;
    this.code += '\n';
  }
}

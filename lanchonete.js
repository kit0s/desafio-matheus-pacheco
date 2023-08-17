class CaixaDaLanchonete {
  constructor() {
    this.rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.cardapio = [
      { codigo: "cafe", descricao: "Café", valor: 3.00, extras: ["chantily"] },
      { codigo: "chantily", descricao: "Chantily (extra do café)", valor: 1.50 },
      { codigo: "suco", descricao: "Suco", valor: 6.20 },
      { codigo: "sanduiche", descricao: "Sanduíche", valor: 6.50, extras: ["queijo"] },
      { codigo: "queijo", descricao: "Queijo (extra do sanduíche)", valor: 2.00 },
      { codigo: "salgado", descricao: "Salgado", valor: 7.25 },
      { codigo: "combo1", descricao: "1 Suco e 1 Sanduíche", valor: 9.50 },
      { codigo: "combo2", descricao: "1 Café e 1 Sanduíche", valor: 7.50 }
    ];
  }

  exibirCardapio() {
    console.log("Cardápio:");
    for (const item of this.cardapio) {
      console.log(`${item.codigo} - ${item.descricao}: R$ ${item.valor.toFixed(2)}`);
    }
  }

  calcularValorTotal(itensSelecionados, formaPagamento) {
    let valorTotal = 0;
    const itensComExtras = [];

    for (const itemSelecionado of itensSelecionados) {
      let valorItem = itemSelecionado.valor;

      if (itemSelecionado.extras) {
        for (const extraCodigo of itemSelecionado.extras) {
          const extraItem = this.cardapio.find(item => item.codigo === extraCodigo);
          if (extraItem && itensSelecionados.includes(extraItem)) {
            valorItem += extraItem.valor;
            itensComExtras.push(extraItem);
          }
        }
      }

      switch (formaPagamento) {
        case "dinheiro":
          valorItem *= 0.95; // Aplica desconto de 5% para pagamento em dinheiro
          break;
        case "credito":
          valorItem *= 1.03; // Aplica acréscimo de 3% para pagamento no crédito
          break;
        case "debito":
          // O valor permanece o mesmo para pagamento no débito
          break;
        default:
          console.log("Forma de pagamento inválida.");
          return null;
      }

      valorTotal += valorItem;
    }

    return { valorTotal, itensComExtras };
  }

  processarPedido(primeiroPedido) {
    if (primeiroPedido) {
      this.exibirCardapio();
    }

    this.rl.question("Digite os códigos dos pedidos (separados por vírgula): ", (codigos) => {
      const codigosSelecionados = codigos.split(",");
      const itensSelecionados = [];

      for (const codigo of codigosSelecionados) {
        const item = this.cardapio.find(item => item.codigo === codigo.trim());
        if (item) {
          itensSelecionados.push(item);
        } else {
          console.log("Item inválido.");
          this.processarPedido(); // Solicitar um novo pedido
          return;
        }
      }

      if (itensSelecionados.length === 0) {
        console.log("Não há itens no carrinho de compra!");
        this.processarPedido(); // Solicitar um novo pedido
        return;
      }

      const pedirFormaPagamento = () => {
        this.rl.question("Forma de pagamento (dinheiro, credito, debito): ", (formaPagamento) => {
          formaPagamento = formaPagamento.toLowerCase(); // Converter para minúsculas

          if (formaPagamento === "dinheiro" || formaPagamento === "credito" || formaPagamento === "debito") {
            const resultadoCalculo = this.calcularValorTotal(itensSelecionados, formaPagamento);
            if (resultadoCalculo !== null) {
              const { valorTotal, itensComExtras } = resultadoCalculo;
              console.log(`Valor total: R$ ${valorTotal.toFixed(2)}`);

              if (itensComExtras.length > 0) {
                console.log("Itens extras incluídos:");
                for (const item of itensComExtras) {
                  console.log(`${item.descricao}: R$ ${item.valor.toFixed(2)}`);
                }
              }
            }
            this.rl.close();
          } else {
            console.log("Forma de pagamento inválida! Insira novamente.");
            pedirFormaPagamento(); // Pedir novamente a forma de pagamento
          }
        });
      };

      pedirFormaPagamento();
    });
  }

  iniciar() {
    this.processarPedido(true);
  }
}

module.exports = { CaixaDaLanchonete };
const caixa = new CaixaDaLanchonete();
caixa.iniciar();

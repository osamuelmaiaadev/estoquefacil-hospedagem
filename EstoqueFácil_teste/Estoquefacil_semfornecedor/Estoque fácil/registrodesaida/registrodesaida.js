document.addEventListener('DOMContentLoaded', function() {
    const produtoSelect = document.getElementById('selectproduto');
    const quantidadeInput = document.getElementById('quantidade');
    const estoqueDisponivelDiv = document.getElementById('estoque-disponivel');

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];

    // Preenche o select de produtos
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.nome;
        option.textContent = produto.nome;
        produtoSelect.appendChild(option);
    });

    // Função para atualizar a quantidade disponível em estoque
    function atualizarEstoqueDisponivel() {
        const produtoSelecionado = produtoSelect.value;
        if (produtoSelecionado) {
            const quantidadeEmEstoque = calcularQuantidadeEmEstoque(produtoSelecionado);
            estoqueDisponivelDiv.textContent = `Quantidade em estoque: ${quantidadeEmEstoque}`;
            quantidadeInput.max = quantidadeEmEstoque; // Define o máximo permitido
        } else {
            estoqueDisponivelDiv.textContent = '';
            quantidadeInput.removeAttribute('max'); // Remove o máximo se nenhum produto for selecionado
        }
    }

    // Função para calcular a quantidade em estoque de um produto
    function calcularQuantidadeEmEstoque(produtoNome) {
        let quantidadeEntrada = 0;
        let quantidadeSaida = 0;

        // Soma as quantidades de entrada
        entradas.forEach(entrada => {
            if (entrada.produto === produtoNome) {
                quantidadeEntrada += entrada.quantidade;
            }
        });

        // Subtrai as quantidades de saída
        const saidas = JSON.parse(localStorage.getItem('saidas')) || [];
        saidas.forEach(saida => {
            if (saida.produto === produtoNome) {
                quantidadeSaida += saida.quantidade;
            }
        });

        return quantidadeEntrada - quantidadeSaida;
    }

    // Atualiza a quantidade disponível quando o produto é selecionado
    produtoSelect.addEventListener('change', atualizarEstoqueDisponivel);

    // Atualiza a quantidade disponível quando a quantidade é alterada
    quantidadeInput.addEventListener('input', function() {
        atualizarEstoqueDisponivel();
    });

    // Função para lidar com o envio do formulário
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const produto = produtoSelect.value;
        const quantidade = parseInt(quantidadeInput.value);
        const quantidadeEmEstoque = calcularQuantidadeEmEstoque(produto);

        if (!produto) {
            alert('Por favor, selecione um produto.');
            return;
        }

        if (quantidade > quantidadeEmEstoque) {
            alert('Quantidade insuficiente em estoque.');
            return;
        }

        const saida = {
            produto: produto,
            quantidade: quantidade
        };

        // Salva a saída no localStorage
        let saidas = JSON.parse(localStorage.getItem('saidas')) || [];
        saidas.push(saida);
        localStorage.setItem('saidas', JSON.stringify(saidas));

        alert('Saída registrada com sucesso!');
        document.querySelector('form').reset();
        atualizarEstoqueDisponivel();
    });

    atualizarEstoqueDisponivel(); // Atualiza a quantidade inicial
});

const menuEstoque = document.getElementById("menuestoque");

menuEstoque.addEventListener("change", function () {
  const paginaSelecionada = this.value;

  if (paginaSelecionada && paginaSelecionada !== "none") {
      window.location.href = paginaSelecionada;
  }
});
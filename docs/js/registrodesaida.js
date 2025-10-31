document.addEventListener('DOMContentLoaded', function() {
    const produtoSelect = document.getElementById('selectproduto');
    const quantidadeInput = document.getElementById('quantidade');
    const estoqueDisponivelDiv = document.getElementById('estoque-disponivel');

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    let saidas = JSON.parse(localStorage.getItem('saidas')) || []; // Carrega as saídas também

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
            quantidadeInput.max = quantidadeEmEstoque;
        } else {
            estoqueDisponivelDiv.textContent = '';
            quantidadeInput.removeAttribute('max');
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
        saidas.forEach(saida => {
            if (saida.produto === produtoNome) {
                quantidadeSaida += saida.quantidade;
            }
        });

        return quantidadeEntrada - quantidadeSaida;
    }

    // Atualiza a quantidade disponível quando o produto é selecionado
    produtoSelect.addEventListener('change', atualizarEstoqueDisponivel);

    // Evento de envio do formulário
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const produto = produtoSelect.value;
        const quantidade = parseInt(quantidadeInput.value);
        const quantidadeEmEstoque = calcularQuantidadeEmEstoque(produto);

        if (!produto || produto === "none") {
            alert('Por favor, selecione um produto.');
            return;
        }

        if (quantidade > quantidadeEmEstoque) {
            alert('Quantidade insuficiente em estoque.');
            return;
        }

        const novaSaida = {
            id: Date.now(),
            produto: produto,
            quantidade: quantidade
        };

        // Adiciona a nova saída ao array existente
        saidas.push(novaSaida);
        
        // Salva o array de saídas atualizado no localStorage
        localStorage.setItem('saidas', JSON.stringify(saidas));

        alert('Saída registrada com sucesso!');
        document.querySelector('form').reset();
        
        // Redireciona para a lista de produtos para atualizar o estoque
        window.location.href = './listadeprodutos.html';
    });
    
    // Atualiza a quantidade inicial
    atualizarEstoqueDisponivel();

    const menuEstoque = document.getElementById("menuestoque");
    menuEstoque.addEventListener("change", function () {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
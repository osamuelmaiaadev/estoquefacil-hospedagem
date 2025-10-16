document.addEventListener('DOMContentLoaded', () => {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    const saidas = JSON.parse(localStorage.getItem('saidas')) || [];
    const stockAlertsContainer = document.getElementById('stock-alerts');
    const noAlertsMessage = document.getElementById('no-alerts-message');
    const clearAllBtn = document.querySelector('.clear-all-btn');

    function calcularEstoque() {
        const estoquePorProduto = {};
        const alertasEstoqueBaixo = [];
        const alertasEstoqueAlto = [];

        // Inicializa o estoque de cada produto e verifica a necessidade de alerta
        produtos.forEach(produto => {
            estoquePorProduto[produto.nome] = 0;
        });

        // Atualiza as quantidades com entradas e saídas
        entradas.forEach(entrada => {
            if (estoquePorProduto[entrada.produto] !== undefined) {
                estoquePorProduto[entrada.produto] += entrada.quantidade;
            }
        });

        saidas.forEach(saida => {
            if (estoquePorProduto[saida.produto] !== undefined) {
                estoquePorProduto[saida.produto] -= saida.quantidade;
            }
        });

        // Cria os alertas de estoque baixo ou alto
        produtos.forEach(produto => {
            const quantidadeAtual = estoquePorProduto[produto.nome];
            if (quantidadeAtual < produto.quantidadeMinima) {
                alertasEstoqueBaixo.push({
                    nome: produto.nome,
                    quantidadeAtual: quantidadeAtual,
                    quantidadeMinima: produto.quantidadeMinima
                });
            }
            if (produto.quantidadeMaxima && quantidadeAtual > produto.quantidadeMaxima) {
                 alertasEstoqueAlto.push({
                    nome: produto.nome,
                    quantidadeAtual: quantidadeAtual,
                    quantidadeMaxima: produto.quantidadeMaxima
                });
            }
        });

        return {
            baixo: alertasEstoqueBaixo,
            alto: alertasEstoqueAlto
        };
    }

    function exibirAlertas() {
        const { baixo, alto } = calcularEstoque();

        stockAlertsContainer.innerHTML = '';
        const temAlertas = baixo.length > 0 || alto.length > 0;
        if (!temAlertas) {
             stockAlertsContainer.appendChild(noAlertsMessage); // Adiciona a mensagem de volta se não houver alertas
             noAlertsMessage.style.display = 'block';
        } else {
            noAlertsMessage.style.display = 'none';
        }


        if (baixo.length > 0) {
            baixo.forEach(alerta => {
                const card = document.createElement('div');
                card.classList.add('alert-card', 'low-stock');
                card.innerHTML = `
                    <i class="fas fa-exclamation-triangle alert-icon"></i>
                    <p class="alert-text">
                        O produto ${alerta.nome} está com estoque baixo. A quantidade atual é de ${alerta.quantidadeAtual}, abaixo do mínimo de ${alerta.quantidadeMinima}.
                    </p>
                `;
                stockAlertsContainer.appendChild(card);
            });
        }

        if (alto.length > 0) {
            alto.forEach(alerta => {
                const card = document.createElement('div');
                card.classList.add('alert-card', 'high-stock');
                card.innerHTML = `
                    <i class="fas fa-info-circle alert-icon"></i>
                    <p class="alert-text">
                        O produto ${alerta.nome} está com estoque alto. A quantidade atual é de ${alerta.quantidadeAtual}, acima do máximo de ${alerta.quantidadeMaxima}.
                    </p>
                `;
                stockAlertsContainer.appendChild(card);
            });
        }
    }
    
    // Ação para o botão "Apagar Todos"
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar todos os alertas? Esta ação não pode ser desfeita.')) {
            // Como os alertas são calculados dinamicamente, "apagar" significa apenas recarregar a lista
            // Se você quiser que o usuário possa "dispensar" um alerta específico, seria preciso armazenar
            // um estado de "dispensado" para cada alerta no localStorage.
            stockAlertsContainer.innerHTML = '';
            stockAlertsContainer.appendChild(noAlertsMessage);
            noAlertsMessage.style.display = 'block';
            
            // Para "apagar" de verdade (se houver a necessidade de persistir o estado de um alerta dispensado)
            // você precisaria de um array de alertas no localStorage e remover eles de lá.
            // Por enquanto, esta ação é mais um "limpar a tela de alertas visíveis".
        }
    });

    exibirAlertas();

    const menuEstoque = document.getElementById("menuestoque");
    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
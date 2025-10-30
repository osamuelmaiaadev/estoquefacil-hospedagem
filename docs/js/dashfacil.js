document.addEventListener('DOMContentLoaded', () => {
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const saidas = JSON.parse(localStorage.getItem('saidas')) || [];

    const totalProdutosElement = document.getElementById('total-produtos');
    const estoqueMinimoElement = document.getElementById('estoque-minimo');
    const vencimentoProximoElement = document.getElementById('vencimento-proximo');
    const produtosVencidosElement = document.getElementById('produtos-vencidos');
    const criticalTbody = document.getElementById('critical-tbody');

    function calcularEstoque() {
        const estoquePorProduto = {};
        const alertasEstoqueMinimo = new Set();
        const vencidos = [];
        const vencimentoProximo = [];

        // Inicializa o estoque de cada produto
        produtos.forEach(produto => {
            estoquePorProduto[produto.nome] = 0;
        });

        // Calcula a quantidade de cada produto com base nas entradas e saídas
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

        // Verifica alertas de estoque mínimo
        produtos.forEach(produto => {
            if (estoquePorProduto[produto.nome] < produto.quantidadeMinima) {
                alertasEstoqueMinimo.add(produto.nome);
            }
        });

        // Verifica vencimentos
        const hoje = new Date();
        entradas.forEach(entrada => {
            const vencimento = new Date(entrada.vencimento);
            const diferencaDias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

            if (diferencaDias < 0) {
                vencidos.push({ ...entrada, diasRestantes: diferencaDias });
            } else if (diferencaDias <= 7) {
                vencimentoProximo.push({ ...entrada, diasRestantes: diferencaDias });
            }
        });

        return {
            total: Object.keys(estoquePorProduto).length,
            estoqueMinimo: alertasEstoqueMinimo.size,
            vencidos,
            vencimentoProximo
        };
    }

    function exibirDashboard() {
        const { total, estoqueMinimo, vencidos, vencimentoProximo } = calcularEstoque();

        totalProdutosElement.textContent = total;
        estoqueMinimoElement.textContent = estoqueMinimo;
        vencimentoProximoElement.textContent = vencimentoProximo.length;
        produtosVencidosElement.textContent = vencidos.length;

        criticalTbody.innerHTML = '';

        // Exibe produtos vencidos
        vencidos.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.produto}</td>
                <td>${item.vencimento}</td>
                <td><span class="danger">${Math.abs(item.diasRestantes)} dias passados</span></td>
                <td><i class="fas fa-trash-alt delete-icon" data-id="${item.id}"></i></td>
            `;
            criticalTbody.appendChild(row);
        });

        // Exibe produtos com vencimento próximo
        vencimentoProximo.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.produto}</td>
                <td>${item.vencimento}</td>
                <td><span class="warning">${item.diasRestantes} dias restantes</span></td>
                <td><i class="fas fa-trash-alt delete-icon" data-id="${item.id}"></i></td>
            `;
            criticalTbody.appendChild(row);
        });
        
        // Adiciona listener para os botões de apagar
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                if (confirm('Tem certeza que deseja apagar esta entrada?')) {
                    // Atualiza o localStorage removendo a entrada
                    let entradasAtualizadas = entradas.filter(e => e.id != itemId);
                    localStorage.setItem('entradas', JSON.stringify(entradasAtualizadas));
                    // Atualiza a dashboard
                    exibirDashboard();
                }
            });
        });
    }

    exibirDashboard();

    const menuEstoque = document.getElementById("menuestoque");
    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
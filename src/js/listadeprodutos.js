document.addEventListener('DOMContentLoaded', function() {
    const productTbody = document.getElementById('product-tbody');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalSpecification = document.getElementById('modal-specification');
    const modalLotesContainer = document.getElementById('modal-lotes-container');
    const closeModal = document.querySelector('.close-modal');
    const viewMoreButton = document.getElementById('view-more-button');
    const procurar = document.getElementById('procurar');

    // Carrega produtos, entradas E saídas do localStorage
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    let saidas = JSON.parse(localStorage.getItem('saidas')) || [];

    // Função para calcular a quantidade total
    function calcularQuantidadeTotal(produtoNome) {
        const quantidadeEntrada = entradas
            .filter(entrada => entrada.produto === produtoNome)
            .reduce((total, entrada) => total + entrada.quantidade, 0);

        const quantidadeSaida = saidas
            .filter(saida => saida.produto === produtoNome)
            .reduce((total, saida) => total + saida.quantidade, 0);
            
        return quantidadeEntrada - quantidadeSaida;
    }

    // Função para criar e exibir a tabela de produtos
    function createProductTable(produtosParaExibir = produtos) {
        productTbody.innerHTML = '';

        const produtosExibidos = produtosParaExibir.slice(0, 15);

        produtosExibidos.forEach(produto => {
            const quantidadeTotal = calcularQuantidadeTotal(produto.nome);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>${quantidadeTotal}</td>
                <td><i class="fas fa-info-circle info-icon" data-product="${produto.nome}"></i></td>
                <td><i class="fas fa-trash-alt" data-product="${produto.nome}"></i></td>
            `;
            productTbody.appendChild(row);
        });

        if (produtosParaExibir.length > 15 && produtosParaExibir === produtos) {
            viewMoreButton.style.display = 'block';
        } else {
            viewMoreButton.style.display = 'none';
        }

        addEventListeners();
    }

    // Função para adicionar os event listeners nos ícones
    function addEventListeners() {
        const infoIcons = document.querySelectorAll('.info-icon');
        const deleteIcons = document.querySelectorAll('.fa-trash-alt');

        infoIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const productName = this.dataset.product;
                showProductDetails(productName);
            });
        });

        deleteIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const productName = this.dataset.product;
                deleteProduct(productName);
            });
        });
    }

    // Função para exibir os detalhes do produto no modal
    function showProductDetails(productName) {
        const produto = produtos.find(p => p.nome === productName);

        if (produto) {
            modalTitle.textContent = produto.nome;
            modalCategory.textContent = produto.categoria;
            modalSpecification.textContent = produto.especificacao;

            modalLotesContainer.innerHTML = '<h3>Detalhes dos Lotes:</h3>';
            
            const lotesDoProduto = entradas.filter(entrada => entrada.produto === productName);
            
            if (lotesDoProduto.length > 0) {
                lotesDoProduto.forEach(lote => {
                    const loteDiv = document.createElement('div');
                    loteDiv.classList.add('lote-details');
                    loteDiv.innerHTML = `
                        <p><strong>Lote:</strong> ${lote.lote}</p>
                        <p><strong>Quantidade:</strong> ${lote.quantidade}</p>
                        <p><strong>Vencimento:</strong> ${lote.vencimento}</p>
                        <p><strong>Fornecedor:</strong> ${lote.fornecedor}</p>
                        <hr>
                    `;
                    modalLotesContainer.appendChild(loteDiv);
                });
            } else {
                modalLotesContainer.innerHTML += '<p>Nenhum lote registrado para este produto.</p>';
            }

            modal.style.display = 'block';
        } else {
            alert('Detalhes do produto não encontrados.');
        }
    }

    // Função para deletar um produto e seus lotes correspondentes
    function deleteProduct(productName) {
        if (confirm(`Tem certeza que deseja excluir ${productName} e todas as suas entradas?`)) {
            produtos = produtos.filter(p => p.nome !== productName);
            entradas = entradas.filter(entrada => entrada.produto !== productName);
            saidas = saidas.filter(saida => saida.produto !== productName); // Adicionado para limpar as saídas também
            
            localStorage.setItem('produtos', JSON.stringify(produtos));
            localStorage.setItem('entradas', JSON.stringify(entradas));
            localStorage.setItem('saidas', JSON.stringify(saidas)); // Salva as saídas atualizadas
            
            createProductTable();
        }
    }

    procurar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProdutos = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm));
        createProductTable(filteredProdutos);
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    viewMoreButton.addEventListener('click', function() {
        createProductTable(produtos);
        this.style.display = 'none';
    });

    createProductTable();
    
    const menuEstoque = document.getElementById("menuestoque");
    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
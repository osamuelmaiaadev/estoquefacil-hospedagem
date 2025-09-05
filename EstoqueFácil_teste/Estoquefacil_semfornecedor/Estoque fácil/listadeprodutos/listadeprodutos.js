document.addEventListener('DOMContentLoaded', function() {
    const productTable = document.querySelector('.product-table table');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalSpecification = document.getElementById('modal-specification');
    const modalLotesContainer = document.getElementById('modal-lotes-container');
    const closeModal = document.querySelector('.close-modal');
    const viewMoreButton = document.getElementById('view-more-button');
    const procurar = document.getElementById('procurar');

    // Carrega apenas o array de produtos, que agora inclui o estoque
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Função para calcular a quantidade total somando todos os lotes de um produto
    function calcularQuantidadeTotal(produto) {
        if (!produto.estoque || produto.estoque.length === 0) {
            return 0;
        }
        return produto.estoque.reduce((total, lote) => total + lote.quantidade, 0);
    }

    // Função para criar e exibir a tabela de produtos
    function createProductTable(produtosParaExibir = produtos) {
        productTable.innerHTML = `
            <tr>
                <td>Nome do Produto</td>
                <td>Quantidade Total</td>
                <td>Detalhes</td>
                <td>Apagar</td>
            </tr>
        `;

        const produtosExibidos = produtosParaExibir.slice(0, 15);

        produtosExibidos.forEach(produto => {
            const quantidadeTotal = calcularQuantidadeTotal(produto);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.nome}</td>
                <td>${quantidadeTotal}</td>
                <td><i class="fas fa-info-circle info-icon" data-product="${produto.nome}"></i></td>
                <td><i class="fas fa-trash-alt" data-product="${produto.nome}"></i></td>
            `;
            productTable.appendChild(row);
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

            // Limpa o conteúdo do contêiner de lotes antes de preencher
            modalLotesContainer.innerHTML = '<h3>Detalhes dos Lotes:</h3>';
            
            if (produto.estoque && produto.estoque.length > 0) {
                // Itera sobre cada lote e cria um novo elemento para exibi-lo
                produto.estoque.forEach(lote => {
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

            modal.style.display = 'block'; // Exibe o modal
        } else {
            alert('Detalhes do produto não encontrados.');
        }
    }

    // Função para deletar um produto e todos os seus lotes
    function deleteProduct(productName) {
        if (confirm(`Tem certeza que deseja excluir ${productName} e todos os seus lotes?`)) {
            produtos = produtos.filter(p => p.nome !== productName);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            createProductTable();
        }
    }

    // Adiciona o event listener para a barra de pesquisa
    procurar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProdutos = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm));
        createProductTable(filteredProdutos);
    });

    // Event listener para fechar o modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Event listener para fechar o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    viewMoreButton.addEventListener('click', function() {
        createProductTable(produtos);
        this.style.display = 'none';
    });

    // Chama a função inicial para exibir a tabela
    createProductTable();
});

// Lógica para o menu de navegação
const menuEstoque = document.getElementById("menuestoque");

    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;

        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
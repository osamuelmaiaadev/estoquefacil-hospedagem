document.addEventListener('DOMContentLoaded', function() {
    const productTable = document.querySelector('.product-table table');
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalSpecification = document.getElementById('modal-specification');
    const modalQuantity = document.getElementById('modal-quantity');
    const modalExpiration = document.getElementById('modal-expiration');
    const modalSupplier = document.getElementById('modal-supplier');
    const closeModal = document.querySelector('.close-modal');
    const viewMoreButton = document.getElementById('view-more-button');
    const procurar = document.getElementById('procurar'); // Obtém a referência correta

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    let saidas = JSON.parse(localStorage.getItem('saidas')) || [];

    function calcularQuantidadeEmEstoque(produtoNome) {
        let quantidadeEntrada = 0;
        let quantidadeSaida = 0;

        entradas.forEach(entrada => {
            if (entrada.produto === produtoNome) {
                quantidadeEntrada += entrada.quantidade;
            }
        });

        saidas.forEach(saida => {
            if (saida.produto === produtoNome) {
                quantidadeSaida += saida.quantidade;
            }
        });

        return quantidadeEntrada - quantidadeSaida;
    }

    function createProductTable(produtosParaExibir = produtos) {
        productTable.innerHTML = `
            <tr>
                <td>Nome do Produto</td>
                <td>Detalhes</td>
                <td>Apagar</td>
            </tr>
        `;

        const produtosExibidos = produtosParaExibir.slice(0, 15);

        produtosExibidos.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${produto.nome}</td>
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

    function showProductDetails(productName) {
        const produto = produtos.find(p => p.nome === productName);
        const entrada = entradas.find(e => e.produto === productName);
        const quantidadeEstoque = calcularQuantidadeEmEstoque(productName);

        if (produto && entrada) {
            modalTitle.textContent = produto.nome;
            modalCategory.textContent = produto.categoria;
            modalSpecification.textContent = produto.especificacao;
            modalQuantity.textContent = quantidadeEstoque;
            modalExpiration.textContent = entrada.vencimento;
            modalSupplier.textContent = entrada.fornecedor;
            modal.style.display = 'block';
        } else {
            alert('Detalhes do produto não encontrados.');
        }
    }

    function deleteProduct(productName) {
        if (confirm(`Tem certeza que deseja excluir ${productName}?`)) {
            produtos = produtos.filter(p => p.nome !== productName);
            entradas = entradas.filter(e => e.produto !== productName);
            saidas = saidas.filter(s => s.produto !== productName);
            localStorage.setItem('produtos', JSON.stringify(produtos));
            localStorage.setItem('entradas', JSON.stringify(entradas));
            localStorage.setItem('saidas', JSON.stringify(saidas));
            createProductTable();
        }
    }

    procurar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProdutos = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm));
        createProductTable(filteredProdutos); // Renderiza os produtos filtrados
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
});

const menuEstoque = document.getElementById("menuestoque");

menuEstoque.addEventListener("change", function () {
    const paginaSelecionada = this.value;

    if (paginaSelecionada && paginaSelecionada !== "none") {
        window.location.href = paginaSelecionada;
    }
});
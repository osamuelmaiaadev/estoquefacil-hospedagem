document.addEventListener('DOMContentLoaded', function() {
    const fornecedoresList = document.getElementById('fornecedoresList');
    const searchInput = document.getElementById('searchInput');
    const adicionarFornecedorButton = document.getElementById('adicionarFornecedor');
    const detalhesFornecedorModal = document.getElementById('detalhesFornecedor');
    const detalhesNomeElement = document.getElementById('detalhesNome');
    const detalhesTelefoneElement = document.getElementById('detalhesTelefone');
    const detalhesEnderecoElement = document.getElementById('detalhesEndereco');
    const detalhesCategoriaElement = document.getElementById('detalhesCategoria');
    const closeModalButton = document.querySelector('.close');


    // Função para exibir os detalhes do fornecedor
    function showDetalhes(nome) {
        const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
        const fornecedor = fornecedores.find(fornecedor => fornecedor.nome === nome);

        if (fornecedor) {
            detalhesNomeElement.textContent = fornecedor.nome;
            detalhesTelefoneElement.textContent = fornecedor.telefone;
            detalhesEnderecoElement.textContent = fornecedor.endereco;
            detalhesCategoriaElement.textContent = fornecedor.categorias ? fornecedor.categorias.join(', ') : 'Não especificada';
            detalhesFornecedorModal.style.display = 'block';
        }
    }

    // Função para renderizar os fornecedores na lista
    function renderFornecedores(fornecedores) {
    fornecedoresList.innerHTML = ''; // Limpa a lista antes de renderizar

    // Adiciona o cabeçalho da lista
    const headerLi = document.createElement('li');
    headerLi.classList.add('header');
    headerLi.innerHTML = `
        <span class="header-name">Nome do Fornecedor</span>
        <span class="header-category">Categoria</span>
        <span class="header-actions">Ações</span>
    `;
    fornecedoresList.appendChild(headerLi);

    fornecedores.forEach(fornecedor => {
        const li = document.createElement('li');
        li.innerHTML = `
    <span>${fornecedor.nome}</span>
    <span>${fornecedor.categorias ? fornecedor.categorias.join(', ') : 'Não especificada'}</span>
    <div>
        <button class="detalhes-button" data-nome="${fornecedor.nome}"><i class="fas fa-info-circle"></i></button>
        <button class="delete-button" data-nome="${fornecedor.nome}"><i class="fas fa-trash"></i></button>
    </div>
    `;
        fornecedoresList.appendChild(li);
    });

    // Adiciona ouvintes de evento aos botões de exclusão e detalhes
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const nome = this.dataset.nome;
            deleteFornecedor(nome);
        });
    });

    document.querySelectorAll('.detalhes-button').forEach(button => {
        button.addEventListener('click', function() {
            const nome = this.dataset.nome;
            showDetalhes(nome);
        });
    });
}

    // Função para excluir um fornecedor
    function deleteFornecedor(nome) {
        let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
        fornecedores = fornecedores.filter(fornecedor => fornecedor.nome !== nome);
        localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
        renderFornecedores(fornecedores);
    }

    // Carrega os fornecedores do localStorage
    let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    renderFornecedores(fornecedores);

    // Adiciona ouvinte de evento para a barra de pesquisa
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredFornecedores = fornecedores.filter(fornecedor => fornecedor.nome.toLowerCase().includes(searchTerm));
        renderFornecedores(filteredFornecedores);
    });

    // Adiciona ouvinte de evento para o botão "Adicionar fornecedor"
    adicionarFornecedorButton.addEventListener('click', function() {
        // Redireciona para cadastrofornecedor.html
        window.location.href = '../cadastrofornecedor/cadastrofornecedor.html';
    });

    // Fecha a tela de detalhes ao clicar no botão de fechar
    if (closeModalButton) { // Verifica se o elemento existe
        closeModalButton.addEventListener('click', function() {
            detalhesFornecedorModal.style.display = 'none';
        });
    }
});

const menuEstoque = document.getElementById("menuestoque");

menuEstoque.addEventListener("change", function () {
    const paginaSelecionada = this.value;

    if (paginaSelecionada && paginaSelecionada !== "none") {
        window.location.href = paginaSelecionada;
    }
});
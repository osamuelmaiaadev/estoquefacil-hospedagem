document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos do formulário
    const nomeInput = document.getElementById('nome');
    const telefoneInput = document.getElementById('telefone');
    const enderecoInput = document.getElementById('endereco');

    // Referências aos elementos do dropdown de seleção múltipla
    const dropdownToggle = document.getElementById('categorias-dropdown');
    const dropdownContent = document.getElementById('dropdown-options');
    const selectedDisplay = document.getElementById('selected-categorias-display');
    const checkboxes = dropdownContent.querySelectorAll('input[type="checkbox"]');

    // Função para limpar os campos do formulário
    function limparCampos() {
        nomeInput.value = '';
        telefoneInput.value = '';
        enderecoInput.value = '';
        // Limpa a seleção das categorias no dropdown
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectedDisplay(); // Atualiza o texto do display do dropdown
    }

    // Limpa os campos do formulário ao carregar a página
    // Remover esta linha se você não quiser limpar os campos no carregamento inicial
    limparCampos();

    // Máscara para o campo de telefone
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        // Aplica a máscara (00) 00000-0000
        if (value.length > 10) { // Para números com 11 dígitos (celular)
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
        } else if (value.length > 6) { // Para números com 10 dígitos (fixo ou celular antigo)
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 6) + '-' + value.substring(6, 10);
        } else if (value.length > 2) { // Para números com 2 ou mais dígitos
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
        }
        e.target.value = value;
    });

    // Lógica para o menu de navegação (select)
    const menuEstoque = document.getElementById("menuestoque");
    if (menuEstoque) {
        menuEstoque.addEventListener("change", function () {
            const paginaSelecionada = this.value;
            if (paginaSelecionada && paginaSelecionada !== "none") {
                window.location.href = paginaSelecionada;
            }
        });
    }

    // Lógica para o dropdown de seleção múltipla de categorias

    // Função para atualizar o texto do display do dropdown
    function updateSelectedDisplay() {
        const selectedLabels = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent); // Pega o texto da label associada

        if (selectedLabels.length === 0) {
            selectedDisplay.textContent = 'Selecione uma ou mais categorias';
        } else if (selectedLabels.length === 1) {
            selectedDisplay.textContent = selectedLabels[0];
        } else {
            selectedDisplay.textContent = `${selectedLabels.length} categorias selecionadas`;
        }
    }

    // Alternar a visibilidade do dropdown ao clicar no toggle
    dropdownToggle.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
        dropdownToggle.classList.toggle('active'); // Adiciona/remove classe para rotacionar a seta
        dropdownToggle.setAttribute('aria-expanded', dropdownContent.classList.contains('show'));
    });

    // Fechar o dropdown se clicar fora dele
    document.addEventListener('click', (event) => {
        if (!dropdownToggle.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
            dropdownToggle.classList.remove('active');
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Atualizar o display quando um checkbox é clicado
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDisplay);
    });

    // Inicializar o display do dropdown com o estado atual
    updateSelectedDisplay();

    // Lógica para o botão "Adicionar ao fornecedor"
    document.getElementById('adicionar').addEventListener('click', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const nome = nomeInput.value;
        const telefone = telefoneInput.value;
        const endereco = enderecoInput.value;
        // Coleta todas as categorias selecionadas
        const categoriasSelecionadas = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value); // Pega o 'value' de cada checkbox marcado

        if (nome && telefone && endereco && categoriasSelecionadas.length > 0) {
            // Obtém a lista existente de fornecedores do localStorage ou inicia um array vazio
            const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];

            // Adiciona o novo fornecedor ao array, incluindo a lista de categorias
            fornecedores.push({ nome, telefone, endereco, categorias: categoriasSelecionadas });

            // Salva o array atualizado no localStorage
            localStorage.setItem('fornecedores', JSON.stringify(fornecedores));

            alert('Cadastro realizado com sucesso!');
            limparCampos(); // Limpa os campos após o cadastro
            // Redireciona para a página de cadastro de produtos
            window.location.href = '../cadastrodeprodutos/cadastrodeprodutos.html';
        } else {
            alert('Por favor, preencha todos os campos e selecione pelo menos uma categoria.');
        }
    });
});
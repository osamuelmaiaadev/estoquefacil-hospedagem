document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form-container form');
    const nomeProdutoInput = document.getElementById('nomedoproduto');
    const categoriaSelect = document.getElementById('categoria');
    const especificacaoInput = document.getElementById('especificacao');
    const quantidadeMinimaInput = document.getElementById('quantidadeMinima');
    const quantidadeMaximaInput = document.getElementById('quantidadeMaxima');
    const menuEstoque = document.getElementById("menuestoque");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Verificação básica para campos vazios
        if (!nomeProdutoInput.value || categoriaSelect.value === 'none' || !especificacaoInput.value || !quantidadeMinimaInput.value || !quantidadeMaximaInput.value) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const novoProduto = {
            id: Date.now(),
            nome: nomeProdutoInput.value,
            categoria: categoriaSelect.value,
            especificacao: especificacaoInput.value,
            quantidadeMinima: parseInt(quantidadeMinimaInput.value),
            quantidadeMaxima: parseInt(quantidadeMaximaInput.value)
        };

        // Recuperar a lista de produtos existente do localStorage
        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

        // Adicionar o novo produto à lista
        produtos.push(novoProduto);

        // Salvar a lista atualizada de volta no localStorage
        localStorage.setItem('produtos', JSON.stringify(produtos));

        alert('Produto adicionado com sucesso!');
        // Limpar o formulário

        form.reset();
        window.location.href = './html/registrodeentrada.html'
    });

    menuEstoque.addEventListener("change", function () {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
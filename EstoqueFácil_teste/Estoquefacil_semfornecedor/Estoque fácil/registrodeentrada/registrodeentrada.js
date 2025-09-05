// registrodeentrada.js

document.addEventListener('DOMContentLoaded', function() {
    const produtoSelect = document.getElementById('produto');
    const fornecedorSelect = document.getElementById('fornecedor');

    // Carrega produtos do localStorage e preenche o select
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.nome;
        option.textContent = produto.nome;
        produtoSelect.appendChild(option);
    });

    // Carrega fornecedores do localStorage e preenche o select
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores.forEach(fornecedor => {
        const option = document.createElement('option');
        option.value = fornecedor.nome;
        option.textContent = fornecedor.nome;
        fornecedorSelect.appendChild(option);
    });

    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const produtoSelecionado = produtoSelect.value;
        const quantidade = document.getElementById('quantidade').value;
        const fornecedorSelecionado = fornecedorSelect.value;
        const vencimento = document.getElementById('vencimento').value;
        const lote = document.getElementById('lote').value;

        if (produtoSelecionado === 'none' || !quantidade || fornecedorSelecionado === 'none' || !vencimento || !lote) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];

        const produtoObj = produtos.find(p => p.nome === produtoSelecionado);
        const fornecedorObj = fornecedores.find(f => f.nome === fornecedorSelecionado);
        
        // Validação da categoria (já está correta)
        if (!fornecedorObj.categorias.includes(produtoObj.categoria)) {
            alert(`O fornecedor "${fornecedorSelecionado}" não entrega a categoria "${produtoObj.categoria}". Por favor, selecione outro fornecedor.`);
            return;
        }

        // Criar o objeto de lote para adicionar ao produto
        const novoLote = {
            quantidade: parseInt(quantidade),
            fornecedor: fornecedorSelecionado,
            vencimento: vencimento,
            lote: lote
        };

        // Adiciona o novo lote ao array de estoque do produto
        produtoObj.estoque.push(novoLote);
        
        // Salva a lista de produtos atualizada no localStorage
        localStorage.setItem('produtos', JSON.stringify(produtos));

        alert('Entrada registrada com sucesso!');
        document.querySelector('form').reset();
        window.location.href = '../listadeprodutos/listadeprodutos.html';
    });

    const menuEstoque = document.getElementById("menuestoque");

    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;

        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
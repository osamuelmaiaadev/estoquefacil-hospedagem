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

        const produto = produtoSelect.value;
        const quantidade = document.getElementById('quantidade').value;
        const fornecedor = fornecedorSelect.value;
        const vencimento = document.getElementById('vencimento').value;
        const lote = document.getElementById('lote').value;

        if (produto === 'none' || !quantidade || fornecedor === 'none' || !vencimento || !lote) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const entrada = {
            produto: produto,
            quantidade: parseInt(quantidade),
            fornecedor: fornecedor,
            vencimento: vencimento,
            lote: lote
        };

        // Salva a entrada no localStorage
        let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
        entradas.push(entrada);
        localStorage.setItem('entradas', JSON.stringify(entradas));

        alert('Entrada registrada com sucesso!');
        document.querySelector('form').reset(); // Limpa o formulário
        window.location.href = '../listadeprodutos/listadeprodutos.html';
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuEstoque = document.getElementById("menuestoque");

  menuEstoque.addEventListener("change", function() {
      const paginaSelecionada = this.value;

      if (paginaSelecionada && paginaSelecionada !== "none") {
          window.location.href = paginaSelecionada;
      }
  });
});
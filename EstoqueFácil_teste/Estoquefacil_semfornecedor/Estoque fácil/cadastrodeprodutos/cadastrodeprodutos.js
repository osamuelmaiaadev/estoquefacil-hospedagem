// cadastrodeprodutos.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const menuEstoque = document.getElementById("menuestoque");

    // Lógica para o menu de navegação
    if (menuEstoque) {
        menuEstoque.addEventListener("change", function() {
            const paginaSelecionada = this.value;
            if (paginaSelecionada && paginaSelecionada !== "none") {
                window.location.href = paginaSelecionada;
            }
        });
    }

    // Lógica para o cadastro de produtos
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const nome = document.getElementById('nomedoproduto').value;
        const categoria = document.getElementById('categoria').value; 
        const especificacao = document.getElementById('especificacao').value;

        if (!nome || categoria === 'none' || !especificacao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const produto = {
            nome: nome,
            categoria: categoria,
            especificacao: especificacao,
            estoque: [] // Adiciona um array para armazenar os lotes e validades
        };

        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        produtos.push(produto);
        localStorage.setItem('produtos', JSON.stringify(produtos));

        alert('Produto cadastrado com sucesso!');
        window.location.href = '../registrodeentrada/registrodeentrada.html';
    });
});
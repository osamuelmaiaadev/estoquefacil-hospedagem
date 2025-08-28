document.querySelector('form').addEventListener('submit', function(event) {
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
      especificacao: especificacao
  };

  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.push(produto);
  localStorage.setItem('produtos', JSON.stringify(produtos));

  alert('Produto cadastrado com sucesso!');
  window.location.href = '../registrodeentrada/registrodeentrada.html';
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

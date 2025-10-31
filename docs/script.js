document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;

        
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData && userData.usuario === usuario && userData.senha === senha) {
            alert('Login realizado com sucesso!');
            window.location.href = 'html/dashfacil.html';
        } else {
            alert('Usuário ou senha incorretos. Por favor, tente novamente.');
        }
    });


    const menuEstoque = document.getElementById("menuestoque");

    if (menuEstoque) {
        menuEstoque.addEventListener("change", function () {
            const paginaSelecionada = this.value;

            if (paginaSelecionada && paginaSelecionada !== "none") {
                window.location.href = paginaSelecionada;
            }
        });
    }
});
// salvo
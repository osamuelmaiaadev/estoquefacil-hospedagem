document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastro-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeEmpresa = document.getElementById('nome-empresa').value;
        const email = document.getElementById('email').value;
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem. Por favor, tente novamente.');
            return;
        }

        const userData = {
            nomeEmpresa: nomeEmpresa,
            email: email,
            usuario: usuario,
            senha: senha
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        window.location.href = '../Login/login.html';
    });
});
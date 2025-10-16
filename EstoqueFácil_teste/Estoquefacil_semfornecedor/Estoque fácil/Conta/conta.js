document.addEventListener('DOMContentLoaded', function () {
    // Carrega os dados do usuário. Se não houver, a página não carregará nada relevante.
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    const nomeEmpresaElement = document.getElementById('nome-empresa');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordButton = document.getElementById('show-password');
    const profileImage = document.querySelector('.profile-image i');
    const editImageButton = document.querySelector('.edit-image');
    const detailInputs = document.querySelectorAll('.detail-input input');
    const buttonContainer = document.getElementById('button-container');
    const sairLink = document.getElementById('sair');
    
    // Armazena a senha real carregada, para ser usada na função de salvar
    let originalPassword = ''; 

    if (userData) {
        nomeEmpresaElement.textContent = userData.nomeEmpresa;
        emailInput.value = userData.email;
        usernameInput.value = userData.usuario;
        
        // Armazena a senha real do localStorage e exibe a mascarada
        originalPassword = userData.senha; 
        passwordInput.value = '********';

        if (userData.profileImage) {
            profileImage.style.backgroundImage = `url(${userData.profileImage})`;
            profileImage.style.backgroundSize = 'cover';
            profileImage.classList.remove('fas', 'fa-user');
        }

        // 1. Lógica do botão "Mostrar Senha"
        showPasswordButton.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordInput.value = originalPassword;
                showPasswordButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                passwordInput.value = '********';
                showPasswordButton.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });

        // 2. Lógica do botão "Alterar" e "Salvar"
        // Cria e adiciona o botão "Alterar" na inicialização
        const alterButton = document.createElement('button');
        alterButton.id = 'alterar-button';
        alterButton.textContent = 'Alterar';

        // Insere o botão 'Alterar' antes do link 'Sair'
        if (sairLink) {
            buttonContainer.insertBefore(alterButton, sairLink);
        } else {
             // Caso o 'sairLink' não seja encontrado, adiciona ao final
            buttonContainer.appendChild(alterButton);
        }

        alterButton.addEventListener('click', function () {
            // Habilita a edição dos campos
            detailInputs.forEach(input => {
                input.readOnly = false;
            });

            // Se o campo de senha estiver mascarado, ele deve se tornar vazio para digitação
            if (passwordInput.type === 'password') {
                passwordInput.value = '';
            }

            alterButton.style.display = 'none'; // Esconde "Alterar"

            // Cria e adiciona o botão "Salvar"
            const saveButton = document.createElement('button');
            saveButton.id = 'save-button';
            saveButton.textContent = 'Salvar';

            if (sairLink) {
                buttonContainer.insertBefore(saveButton, sairLink);
            } else {
                buttonContainer.appendChild(saveButton);
            }

            saveButton.addEventListener('click', function () {
                userData.email = emailInput.value;
                userData.usuario = usernameInput.value;

                
                if (passwordInput.value.trim() !== '') {
                    userData.senha = passwordInput.value;
                    originalPassword = passwordInput.value; // Atualiza a senha real
                }
                
                // Salva todos os dados (atualizados ou não) no localStorage
                localStorage.setItem('userData', JSON.stringify(userData));

                // Volta os campos para somente leitura
                detailInputs.forEach(input => {
                    input.readOnly = true;
                });
                
                // Volta para a visualização de senha mascarada
                passwordInput.type = 'password';
                passwordInput.value = '********';
                showPasswordButton.innerHTML = '<i class="fas fa-eye"></i>';

                saveButton.remove(); 
                alterButton.style.display = 'inline-block';
                alert('Alterações salvas com sucesso! As novas credenciais estão prontas para o próximo login.');
            });
        });


        // 3. Lógica para editar a imagem de perfil
        editImageButton.addEventListener('click', function () {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        profileImage.style.backgroundImage = `url(${e.target.result})`;
                        profileImage.style.backgroundSize = 'cover';
                        profileImage.classList.remove('fas', 'fa-user');
                        userData.profileImage = e.target.result;
                        localStorage.setItem('userData', JSON.stringify(userData));
                    };

                    reader.readAsDataURL(file);
                }
            });

            fileInput.click();
        });
    }
    
    // 4. Lógica de navegação do menu Estoque
    const menuEstoque = document.getElementById("menuestoque");
    menuEstoque.addEventListener("change", function () {
        const paginaSelecionada = this.value;
        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
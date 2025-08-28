document.addEventListener('DOMContentLoaded', function () {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const nomeEmpresaElement = document.getElementById('nome-empresa');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const showPasswordButton = document.getElementById('show-password');
    const profileImage = document.querySelector('.profile-image i');
    const editImageButton = document.querySelector('.edit-image');
    const detailInputs = document.querySelectorAll('.detail-input input');
    const profileDetails = document.querySelector('.profile-details');
    let originalPassword = '********';

    if (userData) {
        nomeEmpresaElement.textContent = userData.nomeEmpresa;
        emailInput.value = userData.email;
        usernameInput.value = userData.usuario;
        originalPassword = userData.senha;
        passwordInput.value = '********';

        if (userData.profileImage) {
            profileImage.style.backgroundImage = `url(${userData.profileImage})`;
            profileImage.style.backgroundSize = 'cover';
            profileImage.classList.remove('fas', 'fa-user');
        }

        showPasswordButton.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordInput.value = originalPassword;
                showPasswordButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                passwordInput.type = 'password';
                showPasswordButton.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });

        if (!document.getElementById('alterar-button')) {
            const buttonContainer = document.createElement('div'); 
            buttonContainer.id = 'button-container';
            profileDetails.appendChild(buttonContainer);
        
            const alterButton = document.createElement('button');
            alterButton.id = 'alterar-button';
            alterButton.textContent = 'Alterar';
            buttonContainer.appendChild(alterButton);
        
            alterButton.addEventListener('click', function () {
                detailInputs.forEach(input => {
                    input.readOnly = false;
                });
        
                alterButton.style.display = 'none';
        
                const saveButton = document.createElement('button');
                saveButton.id = 'save-button';
                saveButton.textContent = 'Salvar';
                buttonContainer.appendChild(saveButton);
        
                saveButton.addEventListener('click', function () {
                    userData.email = emailInput.value;
                    userData.usuario = usernameInput.value;
                    userData.senha = passwordInput.value;
        
                    localStorage.setItem('userData', JSON.stringify(userData));
        
                    detailInputs.forEach(input => {
                        input.readOnly = true;
                    });
        
                    saveButton.style.display = 'none';
                    alterButton.style.display = 'inline-block';
                    alert('Alterações salvas com sucesso!');
                });
            });
        }

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
});

document.addEventListener("DOMContentLoaded", function () {
    const menuEstoque = document.getElementById("menuestoque");

    menuEstoque.addEventListener("change", function () {
        const paginaSelecionada = this.value;

        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
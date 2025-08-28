const notificationList = document.querySelector('.notification-list');
        const notificationDetails = document.getElementById('notification-details');
        const detailsText = document.getElementById('details-text');
        const closeDetailsButton = document.getElementById('close-details');
        const titleElement = document.querySelector('.notification-title-page');

        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
        let saidas = JSON.parse(localStorage.getItem('saidas')) || [];

        const notificationData = {};

        function calcularQuantidadeEmEstoque(produtoNome) {
            let quantidadeEntrada = 0;
            let quantidadeSaida = 0;

            entradas.forEach(entrada => {
                if (entrada.produto === produtoNome) {
                    quantidadeEntrada += entrada.quantidade;
                }
            });

            saidas.forEach(saida => {
                if (saida.produto === produtoNome) {
                    quantidadeSaida += saida.quantidade;
                }
            });

            return quantidadeEntrada - quantidadeSaida;
        }

        function generateNotifications() {
            notificationList.innerHTML = '<h2 class="notification-list-title">Título da Notificação</h2>';

            const vencendo = [];
            const baixoEstoque = [];
            const hoje = new Date();

            produtos.forEach(produto => {
                const quantidadeEstoque = calcularQuantidadeEmEstoque(produto.nome);
                const entrada = entradas.find(e => e.produto === produto.nome);

                if (entrada) {
                    const dataVencimento = new Date(entrada.vencimento);
                    const diffDays = Math.ceil((dataVencimento - hoje) / (1000 * 60 * 60 * 24));

                    if (diffDays === 0) {
                        vencendo.push({ produto: produto.nome, mensagem: 'vence hoje' });
                    } else if (diffDays <= 3 && diffDays > 0) {
                        vencendo.push({ produto: produto.nome, mensagem: `vence em ${diffDays} dias` });
                    }
                }

                if (quantidadeEstoque < 5) {
                    baixoEstoque.push({ produto: produto.nome, estoque: quantidadeEstoque });
                }
            });

            if (vencendo.length === 0 && baixoEstoque.length === 0) {
                notificationList.innerHTML += '<p style="text-align: center;">Sem notificações</p>';
            } else {
                vencendo.forEach(item => {
                    const notificationItem = document.createElement('div');
                    notificationItem.className = 'notification-item';
                    notificationItem.setAttribute('data-id', `vencendo-${item.produto}`);
                    notificationItem.innerHTML = `
                        <span class="notification-title">Alimento ${item.produto} ${item.mensagem}</span>
                        <div class="notification-actions">
                            <i class="fas fa-info-circle notification-icon info-icon"></i>
                            <i class="fas fa-trash-alt notification-icon delete-icon"></i>
                        </div>
                    `;
                    notificationList.appendChild(notificationItem);

                    notificationData[`vencendo-${item.produto}`] = {
                        title: `Alimento ${item.produto} ${item.mensagem}`,
                        message: `O alimento ${item.produto} ${item.mensagem}. Verifique e tome as medidas necessárias.`,
                    };
                });

                baixoEstoque.forEach(item => {
                    const notificationItem = document.createElement('div');
                    notificationItem.className = 'notification-item';
                    notificationItem.setAttribute('data-id', `baixoEstoque-${item.produto}`);
                    notificationItem.innerHTML = `
                        <span class="notification-title">Baixo estoque de ${item.produto}</span>
                        <div class="notification-actions">
                            <i class="fas fa-info-circle notification-icon info-icon"></i>
                            <i class="fas fa-trash-alt notification-icon delete-icon"></i>
                        </div>
                    `;
                    notificationList.appendChild(notificationItem);

                    notificationData[`baixoEstoque-${item.produto}`] = {
                        title: `Baixo estoque de ${item.produto}`,
                        message: `O estoque de ${item.produto} está em apenas ${item.estoque} unidades.  Considere repor o estoque.`,
                    };
                });
            }

            addEventListeners();
        }

        function showNotificationDetails(id) {
            const data = notificationData[id];
            if (data) {
                detailsText.innerHTML = `<h2>${data.title}</h2><p>${data.message}</p>`;
                notificationDetails.classList.add('show');
            }
        }

        function addEventListeners() {
            const notificationItems = document.querySelectorAll('.notification-item');

            notificationItems.forEach(item => {
                const infoIcon = item.querySelector('.info-icon');
                const deleteIcon = item.querySelector('.delete-icon');

                infoIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const notificationId = item.getAttribute('data-id');
                    showNotificationDetails(notificationId);
                });

                deleteIcon.addEventListener('click', (event) => {
                    event.stopPropagation();
                    item.remove();
                    delete notificationData[item.getAttribute('data-id')];
                    notificationDetails.classList.remove('show');
                });

                item.addEventListener('click', () => {
                    const notificationId = item.getAttribute('data-id');
                    showNotificationDetails(notificationId);
                });
            });
        }

        closeDetailsButton.addEventListener('click', () => {
            notificationDetails.classList.remove('show');
        });

        window.addEventListener('click', (event) => {
            if (event.target === notificationDetails) {
                notificationDetails.classList.remove('show');
            }
        });

        generateNotifications();
        setInterval(generateNotifications, 60 * 60 * 1000);

        const menuEstoque = document.getElementById("menuestoque");

        menuEstoque.addEventListener("change", function () {
        const paginaSelecionada = this.value;

        if (paginaSelecionada && paginaSelecionada !== "none") {
                window.location.href = paginaSelecionada;
        }
});
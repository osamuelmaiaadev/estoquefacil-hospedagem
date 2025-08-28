document.addEventListener('DOMContentLoaded', () => {
    const entradas = JSON.parse(localStorage.getItem('entradas')) || [];
    const vencidosTd = document.getElementById('vencidos');
    const alertasTd = document.getElementById('alertas');

    function verificarVencimento() {
        const hoje = new Date();
        const alertas = [];
        const vencidos = [];

        entradas.forEach(entrada => {
            const vencimento = new Date(entrada.vencimento);
            const diferencaDias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

            if (diferencaDias < 0) { // Verifica se já venceu
                vencidos.push(`Produto: ${entrada.produto}, Vencimento: ${entrada.vencimento}, Dias Passados: ${Math.abs(diferencaDias)}`);
            } else if (diferencaDias <= 7) { // Verifica se vence em 7 dias ou menos
                alertas.push(`Produto: ${entrada.produto}, Vencimento: ${entrada.vencimento}, Dias Restantes: ${diferencaDias}`);
            }
        });

        return { alertas, vencidos };
    }

    function exibirAlertas() {
        const { alertas, vencidos } = verificarVencimento();

        vencidosTd.innerHTML = '';
        if (vencidos.length > 0) {
            vencidos.forEach(vencido => {
                const p = document.createElement('p');
                p.textContent = vencido;
                vencidosTd.appendChild(p);
            });
        } else {
            vencidosTd.textContent = 'Nenhum produto vencido.';
        }

        alertasTd.innerHTML = '';
        if (alertas.length > 0) {
            alertas.forEach(alerta => {
                const p = document.createElement('p');
                p.textContent = alerta;
                alertasTd.appendChild(p);
            });
        } else {
            alertasTd.textContent = 'Nenhum alerta de vencimento.';
        }
    }

    exibirAlertas();

    setInterval(exibirAlertas, 60000);

    const menuEstoque = document.getElementById("menuestoque");

    menuEstoque.addEventListener("change", function() {
        const paginaSelecionada = this.value;

        if (paginaSelecionada && paginaSelecionada !== "none") {
            window.location.href = paginaSelecionada;
        }
    });
});
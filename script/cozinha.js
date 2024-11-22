document.addEventListener("DOMContentLoaded", function () {

    const pedidosList = document.getElementById("pedidosList");

    function atualizarPedidos() {
        pedidosList.innerHTML = "";

        mesas.forEach((mesa, index) => {
            if (mesa.pedidos.length > 0) {
                const divPedido = document.createElement("div");
                divPedido.classList.add("pedido-item");

                const tituloPedido = document.createElement("h3");
                tituloPedido.textContent = mesa.nome;

                const infoPedido = document.createElement("div");
                infoPedido.classList.add("pedido-info");
                infoPedido.textContent = `Itens: ${mesa.pedidos.join(", ")}`;

                const botaoLimpar = document.createElement("button");
                botaoLimpar.textContent = "Limpar";
                botaoLimpar.classList.add("limpar-button");
                botaoLimpar.addEventListener("click", () => limparPedidos(index));

                divPedido.appendChild(tituloPedido);
                divPedido.appendChild(infoPedido);
                divPedido.appendChild(botaoLimpar);

                pedidosList.appendChild(divPedido);
            }
        });
    }

    function limparPedidos(index) {
        Swal.fire({
            title: "Deseja limpar os pedidos desta mesa?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não"
        }).then((result) => {
            if (result.isConfirmed) {
                mesas[index].pedidos = []; 
                atualizarPedidos();
                Swal.fire("Pedidos limpos com sucesso!");
            }
        });
    }

    document.getElementById("sairButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    atualizarPedidos();
});

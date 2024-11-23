document.addEventListener("DOMContentLoaded", async function () {
    const API_MESAS_URL = "http://localhost:3333/mesa";
    const pedidosList = document.getElementById("pedidosList");
    let mesas = [];

    async function carregarMesas() {
        try {
            const response = await fetch(`${API_MESAS_URL}/list`);
            if (!response.ok) throw new Error("Erro ao carregar mesas.");

            mesas = await response.json();
            atualizarPedidos();
        } catch (error) {
            console.error("Erro ao carregar mesas:", error);
            Swal.fire("Erro", "Não foi possível carregar as mesas.", "error");
        }
    }

    function atualizarPedidos() {
        pedidosList.innerHTML = "";

        mesas.forEach((mesa, index) => {
            if (mesa.pedidos && mesa.pedidos.length > 0) {
                const divPedido = document.createElement("div");
                divPedido.classList.add("pedido-item");

                const tituloPedido = document.createElement("h3");
                tituloPedido.textContent = `Mesa ${mesa.numero_mesa}`;

                const infoPedido = document.createElement("div");
                infoPedido.classList.add("pedido-info");
                infoPedido.textContent = `Itens: ${mesa.pedidos.map(p => p.nome_produto).join(", ")}`;

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

    async function limparPedidos(index) {
        const mesa = mesas[index];
        Swal.fire({
            title: `Deseja limpar os pedidos da mesa ${mesa.numero_mesa}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_MESAS_URL}/update/${mesa.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pedidos: [] }),
                    });

                    if (!response.ok) throw new Error("Erro ao limpar pedidos.");

                    mesas[index].pedidos = []; 
                    atualizarPedidos();
                    Swal.fire("Sucesso", "Pedidos limpos com sucesso!", "success");
                } catch (error) {
                    console.error("Erro ao limpar pedidos:", error);
                    Swal.fire("Erro", "Não foi possível limpar os pedidos.", "error");
                }
            }
        });
    }

    document.getElementById("sairButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    await carregarMesas();
});

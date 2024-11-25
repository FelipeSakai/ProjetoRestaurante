document.addEventListener("DOMContentLoaded", async function () {
    const API_PEDIDOS_URL = "http://localhost:3333/pedido";
    const API_ITENS_PEDIDO_URL = "http://localhost:3333/item-pedido";
    const pedidosList = document.getElementById("pedidosList");

    async function carregarPedidos() {
        try {

            const pedidosResponse = await fetch(`${API_PEDIDOS_URL}/list`);
            if (!pedidosResponse.ok) throw new Error("Erro ao carregar pedidos.");

            const pedidos = await pedidosResponse.json();

            pedidos.sort((a, b) => new Date(a.data_criacao) - new Date(b.data_criacao));


            atualizarPedidos(pedidos);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            Swal.fire("Erro", "Não foi possível carregar os pedidos.", "error");
        }
    }

    async function carregarItensPedido(idPedido) {
        try {
            const response = await fetch(`${API_ITENS_PEDIDO_URL}/list/${idPedido}`);
            if (!response.ok) throw new Error(`Erro ao carregar itens do pedido ${idPedido}.`);

            return await response.json();
        } catch (error) {
            console.error("Erro ao carregar itens do pedido:", error);
            return [];
        }
    }

    async function atualizarPedidos(pedidos) {
        pedidosList.innerHTML = "";

        for (const pedido of pedidos) {

            const itensPedido = await carregarItensPedido(pedido.id_pedido);

            const divPedido = document.createElement("div");
            divPedido.classList.add("pedido-item");

            const tituloPedido = document.createElement("h3");
            tituloPedido.textContent = `Mesa ${pedido.mesa.numero_mesa} - Pedido `;

            const infoPedido = document.createElement("div");
            infoPedido.classList.add("pedido-info");

            const listaItens = document.createElement("ul");
            itensPedido.forEach((item) => {
                const itemLi = document.createElement("li");
                itemLi.textContent = `Produto: ${item.produto.nome_produto} - Quantidade: ${item.quantidade}`;
                listaItens.appendChild(itemLi);
            });

            infoPedido.appendChild(listaItens);

            divPedido.appendChild(tituloPedido);
            divPedido.appendChild(infoPedido);

            pedidosList.appendChild(divPedido);
        }
    }

    document.getElementById("sairButton").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    await carregarPedidos();
});

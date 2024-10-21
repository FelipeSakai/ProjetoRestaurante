document.addEventListener("DOMContentLoaded", function() {
    const pedidos = [
        { mesa: 3, itens: ['Lanche', 'Refrigerante'] },
        { mesa: 5, itens: ['Pizza', 'Suco']},
        { mesa: 1, itens: ['Sopa', 'Água']}
    ];

    const pedidosList = document.getElementById("pedidosList");

    pedidos.forEach(pedido => {
        const divPedido = document.createElement("div");
        divPedido.classList.add("pedido-item");

        const tituloPedido = document.createElement("h3");
        tituloPedido.textContent = `Mesa ${pedido.mesa}`;

        const infoPedido = document.createElement("div");
        infoPedido.classList.add("pedido-info");
        infoPedido.textContent = `Itens: ${pedido.itens.join(', ')}`;

        divPedido.appendChild(tituloPedido);
        divPedido.appendChild(infoPedido);

        pedidosList.appendChild(divPedido);
    });

    document.getElementById("sairButton").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});

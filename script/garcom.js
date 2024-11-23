const API_MESAS_URL = "http://localhost:3333/mesa";
const API_CARDAPIO_URL = "http://localhost:3333/product";
let mesaAtual = null;
let cardapio = [];

const mesaGridElement = document.getElementById("mesaGrid");
const pedidoGridElement = document.getElementById("pedidoGrid");
const mesaSelecionadaElement = document.getElementById("mesaSelecionada");

async function carregarMesas() {
    try {
        const response = await fetch(`${API_MESAS_URL}/list`);
        if (!response.ok) throw new Error("Erro ao carregar mesas.");

        const mesas = await response.json();
        mesaGridElement.innerHTML = ""; 

        mesas.forEach((mesa) => {
            const mesaDiv = document.createElement("div");
            mesaDiv.classList.add("mesa-item");
            mesaDiv.textContent = `Mesa ${mesa.numero_mesa}`;
            mesaDiv.addEventListener("click", () => selecionarMesa(mesa));
            mesaGridElement.appendChild(mesaDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar mesas:", error);
        Swal.fire("Erro", "Não foi possível carregar as mesas.", "error");
    }
}

async function carregarCardapio() {
    try {
        const response = await fetch(`${API_CARDAPIO_URL}/list`);
        if (!response.ok) throw new Error("Erro ao carregar cardápio.");

        cardapio = await response.json();
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        Swal.fire("Erro", "Não foi possível carregar o cardápio.", "error");
    }
}

function selecionarMesa(mesa) {
    mesaAtual = mesa;
    mesaSelecionadaElement.textContent = `Mesa ${mesa.numero_mesa}`;
    atualizarPedidos();
}

function atualizarPedidos() {
    pedidoGridElement.innerHTML = ""; 

    if (!mesaAtual.pedidos || mesaAtual.pedidos.length === 0) {
        pedidoGridElement.textContent = "Nenhum pedido registrado.";
        return;
    }

    mesaAtual.pedidos.forEach((pedido) => {
        const pedidoDiv = document.createElement("div");
        pedidoDiv.classList.add("pedido-item");

        const nome = document.createElement("div");
        nome.textContent = pedido.nome_produto;

        const valor = document.createElement("div");
        valor.classList.add("valor");
        valor.textContent = `R$ ${pedido.preco.toFixed(2)}`;

        pedidoDiv.appendChild(nome);
        pedidoDiv.appendChild(valor);
        pedidoGridElement.appendChild(pedidoDiv);
    });
}

document.getElementById("adicionarPedido").addEventListener("click", async function () {
    if (!mesaAtual) {
        Swal.fire("Erro", "Selecione uma mesa primeiro!", "warning");
        return;
    }

    const { value: itemIndex } = await Swal.fire({
        title: "Escolha o item",
        input: "select",
        inputOptions: cardapio.reduce((options, item, index) => {
            options[index] = `${item.nome_produto} - R$ ${item.preco.toFixed(2)}`;
            return options;
        }, {}),
        inputPlaceholder: "Selecione um item",
        showCancelButton: true,
    });

    if (itemIndex !== undefined) {
        const itemSelecionado = cardapio[itemIndex];

        if (!mesaAtual.pedidos) {
            mesaAtual.pedidos = [];
        }

        mesaAtual.pedidos.push(itemSelecionado);

        try {
            await fetch(`${API_MESAS_URL}/update/${mesaAtual.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pedidos: mesaAtual.pedidos }),
            });

            atualizarPedidos();
            Swal.fire("Sucesso", `Item "${itemSelecionado.nome_produto}" adicionado com sucesso!`, "success");
        } catch (error) {
            console.error("Erro ao adicionar pedido:", error);
            Swal.fire("Erro", "Não foi possível adicionar o pedido.", "error");
        }
    }
});

(async function inicializar() {
    await carregarCardapio();
    await carregarMesas();
})();

document.getElementById("sairButton").addEventListener("click", function () {
    window.location.href = "index.html";
});

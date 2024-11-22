const API_MESAS_URL = "http://localhost:3333/mesas";
const API_CARDAPIO_URL = "http://localhost:3333/cardapio";

const mesaGridElement = document.getElementById("mesaGrid");
const pedidoGridElement = document.getElementById("pedidoGrid");
const mesaSelecionadaElement = document.getElementById("mesaSelecionada");
let mesaAtual = null;
let cardapio = [];

async function carregarMesas() {
    try {
        const response = await fetch(API_MESAS_URL);
        const mesas = await response.json();

        mesas.forEach((mesa, index) => {
            const mesaDiv = document.createElement("div");
            mesaDiv.classList.add("mesa-item");
            mesaDiv.textContent = mesa.nome;
            mesaDiv.addEventListener("click", () => selecionarMesa(mesa, index));
            mesaGridElement.appendChild(mesaDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar mesas:", error);
        Swal.fire("Erro ao carregar mesas!");
    }
}

async function carregarCardapio() {
    try {
        const response = await fetch(API_CARDAPIO_URL);
        cardapio = await response.json();
    } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        Swal.fire("Erro ao carregar cardápio!");
    }
}


function selecionarMesa(mesa, index) {
    mesaAtual = mesa;
    mesaSelecionadaElement.textContent = mesaAtual.nome;
    atualizarPedidos();
}

function atualizarPedidos() {
    pedidoGridElement.innerHTML = "";

    if (mesaAtual.pedidos.length === 0) {
        pedidoGridElement.textContent = "Nenhum pedido registrado.";
        return;
    }

    mesaAtual.pedidos.forEach(pedido => {
        const pedidoDiv = document.createElement("div");
        pedidoDiv.classList.add("pedido-item");

        const img = document.createElement("img");
        img.src = pedido.imagem;

        const nome = document.createElement("div");
        nome.textContent = pedido.nome;

        const valor = document.createElement("div");
        valor.classList.add("valor");
        valor.textContent = `R$ ${pedido.preco.toFixed(2)}`;

        pedidoDiv.appendChild(img);
        pedidoDiv.appendChild(nome);
        pedidoDiv.appendChild(valor);
        pedidoGridElement.appendChild(pedidoDiv);
    });
}

document.getElementById("adicionarPedido").addEventListener("click", async function () {
    if (!mesaAtual) {
        Swal.fire("Selecione uma mesa primeiro!");
        return;
    }

    const { value: itemIndex } = await Swal.fire({
        title: "Escolha o item",
        input: "select",
        inputOptions: cardapio.reduce((obj, item, index) => {
            obj[index] = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            return obj;
        }, {}),
        inputPlaceholder: "Selecione um item",
        showCancelButton: true
    });

    if (itemIndex !== undefined) {
        const itemSelecionado = cardapio[itemIndex];
        mesaAtual.pedidos.push(itemSelecionado);

        try {
            await fetch(`${API_MESAS_URL}/${mesaAtual.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mesaAtual),
            });

            atualizarPedidos();
            Swal.fire(`Item "${itemSelecionado.nome}" adicionado com sucesso!`);
        } catch (error) {
            console.error("Erro ao atualizar pedidos:", error);
            Swal.fire("Erro ao adicionar pedido!");
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
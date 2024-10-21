const mesas = [
    { nome: "Mesa 1", pedidos: [], total: 0 },
    { nome: "Mesa 2", pedidos: [], total: 0 },
    { nome: "Mesa 3", pedidos: [], total: 0 }
];


const cardapio = [
    { nome: "Lanche", preco: 25.00, imagem: "https://via.placeholder.com/100" },
    { nome: "Refrigerante", preco: 5.00, imagem: "https://via.placeholder.com/100" }
];

const mesaGridElement = document.getElementById("mesaGrid");
const pedidoGridElement = document.getElementById("pedidoGrid");
const mesaSelecionadaElement = document.getElementById("mesaSelecionada");
let mesaAtual = null;


mesas.forEach((mesa, index) => {
    const mesaDiv = document.createElement("div");
    mesaDiv.classList.add("mesa-item");
    mesaDiv.textContent = mesa.nome;
    mesaDiv.addEventListener("click", () => selecionarMesa(index));
    mesaGridElement.appendChild(mesaDiv);
});

function selecionarMesa(index) {
    mesaAtual = mesas[index];
    mesaSelecionadaElement.textContent = mesaAtual.nome;
    atualizarPedidos();
}


function atualizarPedidos() {
    pedidoGridElement.innerHTML = ""; 
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

    const { value: itemNome } = await Swal.fire({
        title: "Escolha o item",
        input: "select",
        inputOptions: cardapio.reduce((obj, item, index) => {
            obj[index] = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
            return obj;
        }, {}),
        inputPlaceholder: "Selecione um item",
        showCancelButton: true
    });

    if (itemNome !== undefined) {
        const itemSelecionado = cardapio[itemNome];
        mesaAtual.pedidos.push(itemSelecionado);
        mesaAtual.total += itemSelecionado.preco;
        atualizarPedidos();
        Swal.fire(`Item "${itemSelecionado.nome}" adicionado com sucesso!`);
    }
});

document.getElementById("sairButton").addEventListener("click", function () {
    window.location.href = "index.html"; 
});
